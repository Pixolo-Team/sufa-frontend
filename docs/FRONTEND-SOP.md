# Frontend SOP

## Core Principles

- Readability over cleverness.
- Feature-based architecture.
- Separate UI, business logic, and data access.
- Strong typing. Avoid `any`.
- Components have a single responsibility.

## Project Structure

- `components/`
- `features/`
- `hooks/`
- `services/`
- `stores/`
- `types/`
- `utils/`

## Import Rules

Group imports in this order: 1. Framework 2. Third-party 3. Internal components 4. Hooks 5. Services / Requests 6. Types 7. Constants / Utils 8. Styles

## File Naming

- All non-component files use **kebab-case**.
- UI component `.tsx` files may use **PascalCase**.
- Examples:
  - `user.service.ts`
  - `user-profile.request.ts`
  - `create-user.service.ts`
  - `UserCard.tsx`

## Function Naming

- camelCase
- Starts with a verb
- Clearly describes the action

## API Request Functions

Any function performing API/HTTP/database access must end with **Request**.

Examples: - `getUsersRequest()` - `createUserRequest()`

## Service Functions

Business logic belongs in services. Service functions end with **Service**.

Examples: - `createUserService()` - `validatePasswordService()`

## Boolean Variables

Must read like a yes/no question.

Good: - `isPopupOpen` - `hasAcceptedTerms` - `canEditPlayer`

Bad: - `isOpen` - `active`

## Data Types

All interfaces/types/DTOs/models/API responses: - PascalCase - End with **Data**

Example: - `UserData` - `AuthenticationResponseData`

## Enum Naming

Enums are always plural.

Example: - `UserRoles` - `PaymentStatuses`

## JSDoc

Every exported function requires JSDoc.

## Comments

Explain **WHY**, not WHAT.

## Error Handling

Never swallow errors. Either: - Throw an Error - Return predictable `{ data, error }`

## Constants

Never hardcode reusable values. Use `constants`, `config`, or `globals`.

## Component Order

```text
// Define Navigation
// Define Context
// Define Refs
// Define States
// Helper Functions
// Use Effects
```

## Additional Rules

- Use aliases instead of deep relative imports.
- No API calls directly inside UI components.
- No business logic inside screens/pages.
- Props must be typed.
- Remove dead code.
- No committed `console.log()`.

# Astro Specific

- Keep pages inside `src/pages`.
- Place reusable UI inside `src/components`.
- Keep integrations inside dedicated service files.
- Use Astro components (`.astro`) for static rendering.
- Hydrate only interactive islands (`client:load`, `client:visible`, etc.).
- Avoid unnecessary client-side JavaScript.
- Business logic belongs in services, not pages.
- Follow the same naming, typing, Request, Service, Data, enum, comment, and error-handling rules defined in the core SOP.
