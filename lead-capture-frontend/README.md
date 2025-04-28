# Charity Lead Capture Frontend

This is the frontend for a charity lead capture application. It provides a chat interface where users can interact with an AI assistant to learn about the charity foundation and potential ways to get involved.

## Features

- Chat interface with AI assistant
- Information about the charity foundation
- Automatic lead capture (name, email, phone, interests)
- Responsive design for all device sizes

## Getting Started

### Prerequisites

- Node.js 16+ and npm/yarn
- FastAPI backend running (see main project README)

### Setup

1. Install dependencies:
```bash
npm install
# or
yarn install
```

2. Create a `.env.local` file based on the example:
```bash
cp src/env.local.example .env.local
```

3. Update the `.env.local` file with your backend API URL:
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Development

Run the development server:
```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Production

Build the production application:
```bash
npm run build
# or
yarn build
```

Then start the production server:
```bash
npm run start
# or
yarn start
```

## Deployment

This Next.js app is ready to be deployed on Vercel:

1. Push your code to a GitHub repository
2. Import the project in Vercel
3. Configure environment variables (NEXT_PUBLIC_API_URL)
4. Deploy

## Technologies

- Next.js 
- TypeScript
- Tailwind CSS
- React Hooks for state management
- Fetch API for backend communication

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
