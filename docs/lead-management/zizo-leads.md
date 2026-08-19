# Football Academy Leads App — Database Schema (v2)

Multi-tenant from day one. Every tenant-scoped table carries `tenant_id`, and every query must filter by it. Fresh, standalone Postgres database. All primary keys are `uuid` (Postgres `uuid` type, generated via `gen_random_uuid()` / `uuid_generate_v4()`).

---

## 1. `tenants`

The Academy (the business). Created directly in the database for now — no signup flow yet.

| Column | Type | Notes |
|---|---|---|
| id | uuid, PK | |
| name | text | Academy name |
| created_at | timestamptz | |
| updated_at | timestamptz | |

---

## 2. `centers`

Branches belonging to a tenant. Leads can be unassigned (nullable FK on `leads`), but a center itself always belongs to exactly one tenant.

| Column | Type | Notes |
|---|---|---|
| id | uuid, PK | |
| tenant_id | uuid, FK → tenants.id | Not null |
| name | text | e.g. "Ghatkopar East" |
| short_code | text(3), unique per tenant | 3-letter code used to build each lead's `readable_lead_id` (e.g. `GKE`) |
| created_at | timestamptz | |
| updated_at | timestamptz | |

---

## 3. `users` (staff)

A user is a person, independent of any single tenant — the tenant relationship (and role within it) lives in `user_tenants`. Login is phone + OTP — no password, no email login.

| Column | Type | Notes |
|---|---|---|
| id | uuid, PK | |
| name | text | |
| phone | text, unique | Login identity |
| phone_verified_at | timestamptz, nullable | Set once OTP verification succeeds |
| created_at | timestamptz | |

### 3a. `otp_codes`

Short-lived OTP requests for phone login. Not user-facing data — purely an auth mechanism.

| Column | Type | Notes |
|---|---|---|
| id | uuid, PK | |
| phone | text | Target phone number (user may not exist yet on first login) |
| code_hash | text | Hashed OTP, never store plaintext |
| expires_at | timestamptz | Short TTL (e.g. 5–10 min) |
| consumed_at | timestamptz, nullable | Set once used, to prevent replay |
| created_at | timestamptz | |

### 3b. `user_tenants` (join table)

A user can belong to multiple tenants, with a different role per tenant.

| Column | Type | Notes |
|---|---|---|
| user_id | uuid, FK → users.id | |
| tenant_id | uuid, FK → tenants.id | |
| role | enum | owner / sales / admin |
| created_at | timestamptz | |
| *(composite PK on user_id + tenant_id)* | | One role per user per tenant |

**Role enum (current):**
```
owner   -- owns the tenant; no extra permissions over admin today, kept distinct for future use
admin   -- reports + leads
sales   -- leads only
```

### 3c. `user_centers` (join table)

Staff can be scoped to one or more centers within a tenant.

| Column | Type | Notes |
|---|---|---|
| user_id | uuid, FK → users.id | |
| center_id | uuid, FK → centers.id | |
| *(composite PK on user_id + center_id)* | | App layer should ensure the user has a `user_tenants` row for that center's tenant |

---

## 4. `leads`

The core entity. Belongs to a tenant; center is nullable (unassigned leads allowed).

| Column | Type | Notes |
|---|---|---|
| id | uuid, PK | Internal ID |
| readable_lead_id | text, unique per tenant | Jira-style. Unassigned leads get `LEAD-{n}` (tenant-level generic prefix). Once a center is assigned, it's regenerated as `{center.short_code}-{n}`, using the next number in that center's own series — the ID changes at that point, it is not preserved from the unassigned state |
| tenant_id | uuid, FK → tenants.id | Not null |
| center_id | uuid, FK → centers.id, nullable | Null = unassigned |
| student_name | text | Not null |
| student_dob | date, nullable | Priority field for age calc |
| student_yob | int, nullable | Fallback if DOB absent |
| age | int, nullable | **Stored directly.** Auto-filled/kept in sync from DOB (preferred) or YOB (fallback) when either is present; directly editable when neither is given (e.g. "8 year old" with no DOB/YOB) |
| parent_name | text, **nullable** | Nullable: the Registration form collects player + phone only, no parent name |
| parent_relation | text/enum, **nullable** | Father / Mother / Guardian / Other. Nullable: the public Enquiry form does not ask for it |
| address | text, **nullable** | Nullable: only the Registration page collects it |
| phone | text, not null | Parent/contact number. **Stored E.164 only** (`+919876543210`). Normalise before insert — the three capture forms submit different formats, and this is the match key for Android call-log duration, so a stray format silently breaks matching |
| stage | enum, not null, **default `fresh_lead`** | See Stage enum below |
| temperature | enum, **nullable**, no default | hot / warm / cold — independent of stage. Null until a staff member first assesses the lead; an inbound lead has no assessable temperature at insert |
| source | enum, not null | Where the lead came from. See Source enum below |
| gender | enum, **nullable** | See Gender enum below |
| other_info | text, **nullable** | Free text from the capture forms ("Other Information" / "Any other details"). Captured at insert so no second write to `notes` is needed |
| consent_at | timestamptz, **nullable** | Set when the lead ticked the Registration form consent box. Null for paths that do not ask |
| trial_date | date, nullable | Editable; every change logged |
| created_at | timestamptz | |
| updated_at | timestamptz | |

**DOB/YOB validation rule:** if both are present and don't agree, reject the write and surface an error — never silently overwrite one with the other.

**Age sync rule:** whenever DOB or YOB is entered/changed, recompute `age` and overwrite the stored value. When a lead has neither DOB nor YOB, `age` becomes a plain direct-entry field.

### Stage enum
```
fresh_lead
contacted
did_not_respond
trial_booked
post_trial_followup
rebooked_trial
won
lost
```
*(`bin_short_term` and `bin_long_term` removed.)*

### Temperature enum
```
hot
warm
cold
```
Nullable — see the column note above.

### Source enum

Where an inbound lead originated. Not null: every insert path knows its own origin, and
staff-entered leads use `operation_portal`.

```
registration_page   -- sufa-frontend public Registration page
homepage_enquiry    -- sufa-frontend public Enquiry form
operation_portal   -- entered by staff through the Operations portal
```

This replaces the old flat table's free-text `other_info` (`"Venue: X"`, `"Subject: Free Trial"`)
for origin purposes. Add a value here rather than overloading `notes` when a new capture
path appears.

### Gender enum

```
male
female
other
```

Nullable. Academies stream squads by gender, so it is a real operational field rather than
demographic decoration — but no current capture form collects it, so it cannot be required
without blocking the `sufa-frontend` cutover. Staff can set it later from the lead detail
screen.

---

## 4a. `lead_id_sequences`

Tracks the next number to use for each `readable_lead_id` prefix, so numbering is per-prefix and gap-free within that prefix.

| Column | Type | Notes |
|---|---|---|
| tenant_id | uuid, FK → tenants.id | |
| prefix | text | `LEAD` (tenant-level fallback) or a center's `short_code` |
| next_number | int | Incremented on each ID generation |
| *(composite PK on tenant_id + prefix)* | | |

---

## 5. `lead_assignees` (join table)

A lead can be assigned to one or multiple staff members.

| Column | Type | Notes |
|---|---|---|
| lead_id | uuid, FK → leads.id | |
| user_id | uuid, FK → users.id | |
| assigned_at | timestamptz | |
| *(composite PK on lead_id + user_id)* | | |

---

## 6. `lead_logs`

Simple, structured activity log — system-generated, not free text. One row per tracked change.

| Column | Type | Notes |
|---|---|---|
| id | uuid, PK | |
| lead_id | uuid, FK → leads.id | Not null |
| field_changed | enum | stage / center / trial_date / temperature / call |
| old_value | text, nullable | Null for events with no prior state (e.g. first center allotment) |
| new_value | text | |
| changed_by | uuid, FK → users.id | Who made the change |
| created_at | timestamptz | |

**Events that generate a log row:**
- Stage changed
- Center allotted (unassigned → center, or center → center)
- Trial date changed
- Temperature changed
- Called lead (call button tapped — anchor row that call duration attaches to afterward, on Android)

---

## 7. `call_history`

Separate from logs because it carries duration and is a distinct record type.

| Column | Type | Notes |
|---|---|---|
| id | uuid, PK | |
| lead_id | uuid, FK → leads.id | Not null |
| called_by | uuid, FK → users.id | |
| call_datetime | timestamptz | |
| duration_seconds | int, nullable | From Android call log via phone number match; always null on iOS — no manual entry |
| platform | enum | android / ios |
| created_at | timestamptz | |

---

## 8. `notes`

Free text. Can optionally be tied to a specific call (explicit FK, not date-matching). Supports pinning.

| Column | Type | Notes |
|---|---|---|
| id | uuid, PK | |
| lead_id | uuid, FK → leads.id | Not null |
| call_id | uuid, FK → call_history.id, nullable | Null = standalone note |
| text | text | |
| is_pinned | boolean, default false | For surfacing important notes among many |
| created_by | uuid, FK → users.id | |
| created_at | timestamptz | |
| updated_at | timestamptz | |

---

## Relationships summary

```
tenants (1) ──< (many) centers
tenants (many) ──< user_tenants >── (many) users
tenants (1) ──< (many) leads

centers (1) ──< (many) leads   [nullable]
centers (many) ──< user_centers >── (many) users

leads (many) ──< lead_assignees >── (many) users
leads (1) ──< (many) lead_logs
leads (1) ──< (many) call_history
leads (1) ──< (many) notes

call_history (1) ──< (many) notes   [nullable link]
```

---

## Lead Progress timeline (query-time merge, not a stored table)

1. Pull all `lead_logs`, `call_history`, and `notes` for the lead
2. Any `notes` row with a non-null `call_id` attaches to that call's block instead of rendering as its own row
3. Remaining top-level items — logs, calls (with attached notes nested inside), and standalone notes — are sorted by timestamp
4. Render one row per top-level item; a call with a linked note renders as a single combined block
5. `is_pinned = true` notes are additionally surfaced outside the chronological flow — exact placement is a UX decision, not a schema one

---

## Open items (flagged, not yet decided)

- Whether a lead can have more than one pinned note at a time, or just one
- Whether `lead_assignees` should distinguish a "primary" assignee from additional ones, or treat all assignees equally
- Whether `readable_lead_id` changes again if a lead is later moved from one center to another (spec so far only covers the unassigned → first-center transition)
- OTP delivery mechanism (SMS provider) is an integration detail, not modeled here
