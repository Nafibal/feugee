This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

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

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Database migrations

The CMS schema is owned by the migration chain in `migrations/`, never by `payload dev`'s live push. Two checks keep it honest:

- **No drift between configs and migrations**: `npx payload migrate:create` should report `No schema changes detected` (decline the blank-file prompt it offers).
- **The chain builds from zero**: before each deploy, run the one-liner below. It stands up a throwaway Postgres, replays every migration from an empty database, and runs the seed end-to-end — proving deploy order will not hit a broken or missing migration. It exits non-zero on any failure (including the container never becoming ready within 30s), never touches a same-named container it did not start, and always tears its own container down. The seed uploads its fixture Assets to the configured bucket, exactly like a local `npm run seed`.

```bash
( docker run --rm -d --name feugee-chain-check -e POSTGRES_USER=chain -e POSTGRES_PASSWORD=chain -e POSTGRES_DB=chain -p 5433:5432 postgres:18-alpine || exit 1; for i in $(seq 1 30); do docker exec feugee-chain-check pg_isready -U chain -q && ready=1 && break; sleep 1; done; [ "$ready" = 1 ] && DATABASE_URL='postgres://chain:chain@localhost:5433/chain' npm run migrate && DATABASE_URL='postgres://chain:chain@localhost:5433/chain' npm run seed; rc=$?; docker rm -f feugee-chain-check >/dev/null; exit $rc )
```

`npm run migrate:status` against the target database should likewise show every migration as ran before a deploy ships.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
