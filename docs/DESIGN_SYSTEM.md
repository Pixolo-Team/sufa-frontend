# Design System

The visual and structural rules behind the Skorost United Football Academy site. Read this before
adding a section, a component, or a style — the goal is that new work is indistinguishable from what
already exists.

The site is a single page for a kids' football academy. The tone is **bold, playful and energetic**:
oversized type, hand-drawn mascots, playful rotations, and animation that rewards scrolling. It is
not a corporate or minimal design. When in doubt, go bigger and more confident rather than smaller
and more restrained.

---

## 1. Token architecture

Never hardcode a colour, size, or spacing value. Everything flows through a three-layer token
pipeline defined in `src/styles/tokens/`:

```
primitive.scss              Raw values      --color-green-500: #16db93
        ↓
{light,dark}/semantic-*     Meaning         --color-brand-primary-regular: var(--color-green-500)
        ↓
{light,dark}/components-*   Component role  --color-button-background-primary-solid-default: var(--color-brand-primary-regular)
```

**Always consume the highest layer available.** In a component stylesheet, use a component token if
one exists, otherwise a semantic token. Reach for a primitive only when adding a new semantic token.

```scss
// Correct
color: var(--color-brand-primary-deep);
padding: var(--padding-large);
font-size: var(--color-brand-font-size-5xlarge);

// Wrong — bypasses the system
color: #0f9563;
padding: 16px;
font-size: 40px;
```

Both themes are declared, but light is the working theme — dark mode exists in the token files and
is toggled by `src/scripts/theme.ts`, which puts `light` or `dark` on `<html>`.

> **Known debt:** a handful of files carry `//TODO: Add token` next to a literal value (course card
> accent colours, a few oversized display sizes, `#000` in `coaches-card`). Do not copy that habit.
> If you need a value that has no token, add one to the semantic layer.

---

## 2. Colour

### Brand palette

| Role | Token | Value | Where it is used |
| --- | --- | --- | --- |
| Primary | `--color-brand-primary-regular` | `#16db93` green | Scrolling banners, icons, sticky bar |
| Primary deep | `--color-brand-primary-deep` | `#0f9563` green | **The signature colour.** Headings, banner background, footer, active accordion |
| Primary tint | `--color-brand-primary-tint` | `#a2f6d7` | Hover fills |
| Primary contrast | `--color-brand-primary-contrast` | `#ffffff` | Text on any primary surface |
| Secondary | `--color-brand-secondary-regular` | `#ff3370` pink | **Every call to action.** Also the floating hearts |
| Tertiary | `--color-brand-tertiary-regular` | `#0197f6` blue | Reserved; unused on the home page |

### The two-colour rule

The design runs on **deep green for structure, pink for action**. Headings, section titles and dark
surfaces are green; anything the user should click is pink. Do not introduce a third accent for a
new CTA — use `Colors.SECONDARY`.

### Page surfaces

- Page background: `--color-brand-neutral-light-300` (`#f4f5f7`) — set on `body`
- Raised surfaces (header, cards, accordion): `--color-background-light-tint` (`#ffffff`)
- Inset surfaces (closed accordion): `--color-brand-neutral-light-200` (`#fafbfc`)
- Body text: `--color-foreground-light-regular` (`#172b4d`)

### Playful accents

Course cards break the two-colour rule on purpose. Each card gets a `--card-color` set by
`:nth-child()` in `courses.module.scss`, cycling green → purple → orange. That variable drives the
card's border and title bar. This is the one sanctioned place for off-palette colour; keep the
rotation if you add cards.

---

## 3. Typography

### Families

| Variable | Font | Use |
| --- | --- | --- |
| `--font-family-primary` | **Kippax Modern** (self-hosted, `public/fonts/`) | Everything by default — set on `body` and all `h1`–`h6` |
| `--font-family-secondary` | **Montserrat Variable** (`@fontsource-variable`) | Buttons, inputs, and anything with `.font-secondary` |

Kippax carries the brand. Apply Montserrat only through the `.font-secondary` utility, as the coach
cards do.

### Size scale

Sizes are semantic aliases, not raw pixels. The two families you will use:

- **Display / heading:** `--color-brand-font-size-{5,6,7,8,9,10}xlarge` → 40px…84px
- **Body / UI:** `--color-brand-font-size-{xsmall,small,regular,medium,large,xlarge}` → 12px…24px

The display sizes carry the design. Section headings routinely sit at 8xlarge (64px) on desktop, and
the banner headline reaches 9xlarge (72px). **Do not tone these down** — undersized display type is
the fastest way to make a new section look wrong.

### Weight

Weight is applied with global utility classes, never inline CSS:

```html
<p class="font-weight-700">…</p>
```

Available: `font-weight-100` through `font-weight-900`. In practice:

- `700` — section headings, titles, banner headline
- `800` — the heaviest display text (faded section labels, footer, names)
- `500` — subheadings, nav links, body emphasis
- `400` — paragraphs

### Case

Display text is frequently `text-transform: uppercase` (section faded labels, "ESTABLISHED IN 2003",
scrolling banners, footer). Body copy is sentence case.

---

## 4. Layout

### Container

Wrap section content in `.container` (defined in `globals.scss`). It is fixed-width per breakpoint
with a constant 15px gutter:

| Breakpoint | Width |
| --- | --- |
| ≥1501px | 1440px |
| 1201–1500px | 1140px |
| 993–1200px | 970px |
| 768–992px | 750px |
| ≤767px | 100% |

`.left-container-padding` is the half-bleed variant: it pads only the left edge to align with the
container while letting content run to the right edge. Used by the founder's message.

### Section rhythm

Every section is a `<section class="section-spacing">` — 70px top and bottom. Override only with the
`.padding-bottom-0` utility, as the contact section does to let its image meet the footer.

```astro
<section class="section-spacing">
  <div class="container">
    <SectionHeader fadedText="Champs" highlightedText="Meet Our Graduates" />
    <!-- … -->
  </div>
</section>
```

Sliders and full-bleed sections skip `.container` so they can run edge to edge.

### Breakpoints

**Mobile first.** Base styles target the smallest screen; `min-width` queries add up from there. Every
stylesheet ends with the same four blocks, left empty when unused — keep them, they are the map:

```scss
// Mobile Phones
@media only screen and (min-width: 600px) {}

// Ipad Mini
@media only screen and (min-width: 768px) {}

// Ipad air
@media only screen and (min-width: 992px) {}

// Small laptops
@media only screen and (min-width: 1500px) {}
```

`.hide-on-mobile` and `.hide-on-desktop` swap content at the 600px line — used where a control needs
different sizing per device rather than different content.

### Flex utilities

Layout is composed with global utility classes rather than per-component flex rules:

`flex` · `flex-column` · `flex-wrap` · `align-center` · `align-start` · `align-end` ·
`justify-center` · `justify-between` · `justify-start` · `justify-end` · `text-center` ·
`text-left` · `text-right`

```html
<div class={`${styles.contentWrapper} flex justify-center align-center`}>
```

Gaps and dimensions belong in the component's own SCSS module; direction and alignment belong in
utility classes.

---

## 5. Shape, elevation and motion

### Radius

Generous and soft throughout.

- Cards, header, modal: `--border-radius-large` (12px)
- Accordion items: 16px
- Sticky social bar: 20px
- Course cards: 20px with a 12px coloured border
- Circular buttons and avatars: `100%` / `50%`
- Banner: `3vw` on its bottom corners only

### Elevation

Shadows are rare and soft — the design separates with colour and radius, not depth.

```scss
box-shadow: 0px 0px 2px 2px rgba(0, 0, 0, 0.1);          // sticky social
filter: drop-shadow(2px 2px 8px rgba(0, 0, 0, 0.25));    // circular icon buttons
box-shadow: 0px 10px 40px 10px rgba(0, 0, 0, 0.2);       // course card on hover
```

### Timing

| Duration | Use |
| --- | --- |
| `0.1s ease-in-out` | Button press feedback |
| `0.2s ease-in-out` | Accordion height, small hovers |
| `0.3s ease-in-out` / `ease-out` | Header hide/show, dropdown, modal, sticky bar |
| `0.4s ease-out` | `.fade-in-up` scroll reveal |
| `0.5s ease-in-out` | Slider card scaling |

Use `ease-out` for things entering, `ease-in-out` for reversible state.

### Motion vocabulary

Motion is a first-class part of this design, not decoration. Four recurring devices:

1. **Scale on hover, shrink on press** — every button: `scale(1.05)` hover, `scale(0.95)` active.
2. **Lift on hover** — icons and images translate up (`translateY(-10px)`, `translateY(-15%)`).
3. **Rotation as playfulness** — the scrolling banners sit at `±5deg`; the banner text animates in
   from `-6deg` to `0deg`.
4. **Scroll-linked parallax** — images drift, headings scale down as they enter.

### Scroll reveal

Add `fade-in-up` to any element that should reveal on scroll. ScrollOut handles the rest.

```html
<p class={`${styles.title} font-weight-700 fade-in-up`}>Still have any Question?</p>
```

It transitions from `translateY(50px)` / `opacity: 0.8` to rest. It fires **once**.

### Scroll-linked parallax

Declared with data attributes and driven by `src/scripts/scroll-animations.ts`. No JavaScript is
written per section.

```astro
<div
  data-parallax="y"
  data-from="-20%"
  data-to="20%"
  data-parallax-target="[data-established-section]"
>
```

| Attribute | Meaning |
| --- | --- |
| `data-parallax` | `"y"`, `"x"`, or `"scale"` |
| `data-from` / `data-to` | Start and end values for `y`/`x`, with units |
| `data-values` | Comma-separated stops for `scale`, spread evenly (e.g. `2,1.2,1`) |
| `data-parallax-target` | Selector whose scroll progress drives it; defaults to the element |

Progress runs 0→1 across `["start end", "end start"]` — from the target entering the viewport bottom
to leaving the top.

Smooth scrolling is provided globally by Lenis; do not add per-section scroll handlers.

---

## 6. Component patterns

### Section header

Every content section opens with the same device: a huge, near-invisible word behind a solid title.

```astro
<SectionHeader fadedText="Guruji" highlightedText="Our Coaches" />
```

- `fadedText` — uppercase, 7xlarge–8xlarge, primary-deep at `opacity: 0.1`, scales 2→1 on scroll
- `highlightedText` — primary-deep, pulled up with a negative margin (`-36px` mobile, `-50px`
  desktop) so it overlaps the faded word
- `leftImage` — optional mascot beside the pair (the squirrel on the FAQ)

Use it for every new section. It is the strongest unifying element on the page.

### Buttons

Always `Button.astro` (or `Button.tsx` inside the React island). Never a bare `<button>` for a CTA.

```astro
<Button
  text="Book a Free Trial Now"
  color={Colors.SECONDARY}
  size={ButtonSizes.XLARGE}
  shape={Shapes.ROUNDED}
  level={ButtonLevels.INLINE}
  extraClass="font-weight-600"
  dataAttributes={{ "data-enquiry-trigger": "" }}
/>
```

Classes are generated combinatorially from `variant × color`, `size × shape × iconPosition`, and
`level`, so any combination in the enums works. Options live in `src/neevo/enums/`:

- `Variants` — `SOLID` · `SOFT` · `OUTLINE` · `PLAIN`
- `Colors` — `PRIMARY` · `SECONDARY` · `TERTIARY` · `NEUTRAL_LIGHT` · `NEUTRAL_DARK` · `SUCCESS` · `WARNING` · `ERROR`
- `ButtonSizes` — `SMALL` · `MEDIUM` · `LARGE` · `XLARGE` · `XXLARGE`
- `Shapes` — `DEFAULT` · `ROUNDED` · `SQUARED`
- `ButtonLevels` — `INLINE` · `BLOCK`

**The house CTA is** `SECONDARY` + `ROUNDED` + `XLARGE` + `INLINE` + `font-weight-600`. Match it
unless there is a reason not to. Use `BLOCK` on mobile via the `hide-on-*` pairing.

### Cards

Three card styles, all sharing white surface + large radius:

- **Course card** — coloured 12px border, 16:9 image, title bar in the accent colour bottom-left,
  circular white arrow button bottom-right, 3D tilt on hover
- **Coach card** — name in two weights above a circular photo, floating circular Instagram button,
  designation `Chip` overhanging the left edge
- **Graduate card** — portrait image; text is hidden and only revealed on the centred slide

### Circular icon button

A recurring motif: a perfect circle, white or light background, coloured icon, sometimes a
drop-shadow. Sizes seen: 38px (arrows, course cards), 54px (coach social). Reuse rather than invent.

### Accordion

Closed items sit on `neutral-light-200`; the open item inverts to a solid `primary-deep` panel with
contrast text. The icon swaps `plus` → `minus`. Height is animated from `0` to `scrollHeight`. Only
one may be open at a time.

### Auto-hiding header

The floating header is a pill centred at `top: 24px`, 80% wide, on a white surface with
`--border-radius-large`. It hides on scroll down and returns on scroll up — driven entirely by CSS
reacting to the `data-scroll-dir-y` attribute that ScrollOut writes onto `<html>`:

```scss
[data-scroll-dir-y="1"]  { .headerWrap { transform: translateY(-100%) translateX(-50%); opacity: 0; } }
[data-scroll-dir-y="-1"] { .headerWrap { transform: translateY(0) translateX(-50%);      opacity: 1; } }
```

That attribute is a free by-product of `initScrollReveals()`. Any component can react to scroll
direction the same way, without writing a scroll listener.

Below 768px the inline nav is replaced by the hamburger and a dropdown panel that slides down from
the pill.

### Icons

Always via the `Icon` component — never an inline `<svg>` or an `<img>` to an SVG file.

```astro
<Icon iconName="quote" class={styles.quoteIcon} mode="filled" />
```

Icons live in `public/icons/filled/` and `public/icons/outline/`; the file name is the `iconName`.
They are inlined at build time and coloured with the CSS `color` property (they use
`fill="currentColor"`). To add one, drop a 20×20 SVG into the right folder — no registration needed.

Brand logos use `InlineSvg` instead, reading from `public/images/`.

---

## 7. Writing a new section

1. Create `src/sections/home/YourSection.astro` and `src/sections/home/your-section/your-section.module.scss`.
2. Import the section into `src/pages/index.astro` and place it in the running order.
3. Open with `<section class="section-spacing">` and, unless full-bleed, a `.container`.
4. Lead with `<SectionHeader />`.
5. Add `fade-in-up` to text and images that should reveal.
6. Use `Button.astro` for any CTA, with `data-enquiry-trigger` if it opens the enquiry modal.
7. Keep content data in a typed array in the frontmatter and `.map()` over it — see `Coaches.astro`.
8. End the stylesheet with the four standard breakpoint blocks.

```astro
---
// STYLES //
import styles from "./your-section/your-section.module.scss";

// COMPONENTS //
import SectionHeader from "@/components/section-header/SectionHeader.astro";
---

<section class="section-spacing">
  <div class="container">
    <SectionHeader fadedText="Faded" highlightedText="Your Title" />
    <p class={`${styles.description} text-center font-weight-500 fade-in-up`}>
      Supporting copy.
    </p>
  </div>
</section>
```

---

## 8. Code conventions

- **Tabs** for indentation, double quotes, semicolons, 80 column print width.
- **SCSS modules** — one per component, co-located, named `kebab-case.module.scss`; class names
  inside are `camelCase` and consumed as `styles.camelCase`.
- **Nest** selectors to mirror the markup, as the existing files do.
- **Banner comments** in frontmatter, in this order and uppercase:
  `// TYPES //` · `// ENUMS //` · `// STYLES //` · `// LAYOUTS //` · `// COMPONENTS //` ·
  `// SECTIONS //` · `// API SERVICES //` · `// SERVICES //` · `// UTILS //`
- **Comment above each markup block** describing what it is (`{/* Section header component */}`).
- **`data-*` attributes** connect markup to behaviour. Never select by generated CSS-module class
  name in a script; when a script needs a class it is passed via a data attribute
  (`data-show-class={styles.showPopup}`).
- **Static by default.** Interactivity goes in an Astro `<script>` block in plain TypeScript. React
  is reserved for genuinely stateful forms; the enquiry form is currently the only island.
