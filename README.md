# Skorost United Football Academy

A single page marketing site built with [Astro](https://astro.build/). Every section is authored as
its own `.astro` component and composed on the home page.

## Getting Started

First, set up your environment variables:

1. Create a `.env` file in the root directory
2. Add the values listed under [Environment Variables](#environment-variables)

Then, run the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:4321](http://localhost:4321) with your browser to see the result.

## Scripts

| Command           | Description                                        |
| ----------------- | -------------------------------------------------- |
| `npm run dev`     | Start the dev server on port 4321                  |
| `npm run build`   | Build the production output into `dist/`           |
| `npm run preview` | Preview the production build locally               |
| `npm run check`   | Type check every `.astro`, `.ts` and `.tsx` file   |

## Project Structure

```
├── public/
│   ├── fonts/
│   ├── icons/
│   └── images/
├── src/
│   ├── components/     # Shared UI components
│   ├── enums/
│   ├── layouts/        # BaseLayout — <head>, header, footer, smooth scroll
│   ├── neevo/          # Reusable design system
│   ├── pages/          # Routes: index, 404, setting, registrations/[taskId]
│   ├── scripts/        # Client side behaviour shared across components
│   ├── sections/home/  # One file per section of the one pager
│   ├── services/
│   ├── styles/         # Global SCSS, design tokens, page level modules
│   ├── types/
│   └── utils/
├── .env
├── .env.example
├── astro.config.mjs
├── cspell.json
├── LICENSE
├── tsconfig.json
├── package.json
└── README.md
```

### Sections

The home page (`src/pages/index.astro`) composes the sections in order:

`Banner` → `FoundersMessage` → `Established` → `Courses` → `ChildrenToChampions` →
`GetFreeTrial` → `Graduates` → `Coaches` → `Faq` → `JoinUs` → `ContactUs`

Each lives in `src/sections/home/` next to the SCSS module it uses.

### Client side behaviour

Sections are static HTML by default. Interactive behaviour is added with plain TypeScript in
`<script>` blocks, backed by the helpers in `src/scripts/`:

| Script                 | Responsibility                                                  |
| ---------------------- | --------------------------------------------------------------- |
| `smooth-scroll.ts`     | Boots Lenis smooth scrolling                                     |
| `scroll-animations.ts` | ScrollOut reveals plus the scroll linked parallax transforms     |
| `carousel.ts`          | Mounts Splide carousels and wires the custom arrows              |
| `theme.ts`             | Reads, persists and applies the light/dark theme                 |

The only React island is the enquiry form (`src/components/enquiry-form/EnquiryForm.tsx`),
hydrated with `client:idle`.

### Rendering modes

Every route is prerendered to static HTML except `registrations/[taskId]`, which opts out with
`export const prerender = false` because the task id is only known at request time. Deployment
targets Vercel through the `@astrojs/vercel` adapter.

## Using the Neevo Folder

The Neevo folder contains core components and functionality that can be reused in other projects.
Copy the entire folder into the new project's `src/` directory.

```
neevo/
├── components/
├── enums/
├── services/
├── types/
└── utils/
```

Components exist as `.astro` (for static usage) and, where interactivity inside a React island is
needed, as `.tsx`.

## Environment Variables

Astro only exposes variables to the browser when they are prefixed with `PUBLIC_`.

```env
PUBLIC_PRIVYR_API_KEY=
```

Contact adarsh.pixolo@gmail.com to obtain these values.

## Learn More

- [Astro Documentation](https://docs.astro.build) — learn about Astro features and APIs
- [Astro Discord](https://astro.build/chat)

## Deploy on Vercel

Pushes to `development` trigger a Vercel deploy hook (see `.github/workflows/vercel-deploy.yml`).
