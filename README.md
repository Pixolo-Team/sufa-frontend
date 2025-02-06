# Project Name

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, set up your environment variables:

1. Contact Adarsh Anchan at adarsh.pixolo@gmail.com to obtain the necessary Firebase environment variables
2. Create a `.env.local` file in the root directory
3. Add the provided Firebase configuration variables to your `.env.local` file

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Project Structure

```
├── public/
│   ├── icons/
│   ├── images/
│   ├── styles/
├── src/
│   ├── app/
│   ├── components/
│   ├── contexts/
│   └── infrastructure/
│   └── services/
│   └── types/
│   └── utils/
├── .env.local
├── .env.example
├── .eslintrc.json
├── .gitignore
├── cspell.json
├── firebase.ts
├── LICENSE
├── next.config
├── tsconfig.json
├── package.json
└── README.md
```

## Using the Neevo Folder

The Neevo folder contains all core components and functionality that can be easily reused in other projects. To integrate it into your other Next.js project, simply copy the entire Neevo folder into your new project's root directory. Here’s how:

### Folder Structure of Neevo

```
neevo/
├── assets/
│   └── icons/
├── components/
├── contexts/
├── enums/
├── infrastructure/
├── types/
└── utils/ 
```

## Environment Variables

The following environment variables are required for Firebase configuration:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

Contact adarsh.pixolo@gmail.com to obtain these values.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
