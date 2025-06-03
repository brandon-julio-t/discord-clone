# Discord Clone

A modern Discord clone built with Next.js 15, React 19, and TypeScript. This project replicates Discord's core features with a focus on real-time communication, server management, and user interactions.

## 🚀 Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) with App Router
- **UI**: [React 19](https://react.dev/) + [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- **Authentication**: [Better Auth](https://better-auth.dev/)
- **Database**: [Prisma](https://www.prisma.io/) with [PostgreSQL](https://www.postgresql.org/)
- **State Management**: [TanStack Query](https://tanstack.com/query/latest) (React Query)
- **API Layer**: [tRPC](https://trpc.io/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with modern animations
- **Form Handling**: [React Hook Form](https://react-hook-form.com/) with [Zod](https://zod.dev/) validation
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) (built on Radix UI primitives)
- **Real-time Features**: [Electric SQL](https://electric-sql.com/)

## ✨ Features

- Modern, responsive UI with dark/light mode support
- Real-time messaging and presence
- Server and channel management
- User authentication and authorization
- Type-safe API with tRPC
- Form validation and error handling
- Optimized performance with Next.js 15
- Full TypeScript support

## 🛠️ Development

```bash
# Install dependencies
bun install

# Start Docker containers (PostgreSQL and Electric SQL)
docker compose up -d

# Run database migrations
bun prisma migrate dev

# Run development server
bun run dev
```

## 📝 License

MIT License - feel free to use this project for learning and development purposes.

---

# Create T3 App

This is a [T3 Stack](https://create.t3.gg/) project bootstrapped with `create-t3-app`.

## What's next? How do I make an app with this?

We try to keep this project as simple as possible, so you can start with just the scaffolding we set up for you, and add additional things later when they become necessary.

If you are not familiar with the different technologies used in this project, please refer to the respective docs. If you still are in the wind, please join our [Discord](https://t3.gg/discord) and ask for help.

- [Next.js](https://nextjs.org)
- [NextAuth.js](https://next-auth.js.org)
- [Prisma](https://prisma.io)
- [Drizzle](https://orm.drizzle.team)
- [Tailwind CSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)

## Learn More

To learn more about the [T3 Stack](https://create.t3.gg/), take a look at the following resources:

- [Documentation](https://create.t3.gg/)
- [Learn the T3 Stack](https://create.t3.gg/en/faq#what-learning-resources-are-currently-available) — Check out these awesome tutorials

You can check out the [create-t3-app GitHub repository](https://github.com/t3-oss/create-t3-app) — your feedback and contributions are welcome!

## How do I deploy this?

Follow our deployment guides for [Vercel](https://create.t3.gg/en/deployment/vercel), [Netlify](https://create.t3.gg/en/deployment/netlify) and [Docker](https://create.t3.gg/en/deployment/docker) for more information.
