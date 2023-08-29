# Create T3 App

This is a [T3 Stack](https://create.t3.gg/) project bootstrapped with `create-t3-app`.

## What's next? How do I make an app with this?

We try to keep this project as simple as possible, so you can start with just the scaffolding we set up for you, and add additional things later when they become necessary.

If you are not familiar with the different technologies used in this project, please refer to the respective docs. If you still are in the wind, please join our [Discord](https://t3.gg/discord) and ask for help.

- [Next.js](https://nextjs.org)
- [NextAuth.js](https://next-auth.js.org)
- [Prisma](https://prisma.io)
- [Tailwind CSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)
- [sst](https://docs.sst.dev/start/nextjs)

## stack

beyond the above listed free to use technologies, we are also using free tier of paid technologies:

- DB: (vitess) Planetscale's MySQL [Planetscale](https://planetscale.com/)
- Logging/Monitoring: [Axiom](https://app.axiom.co/)
- Dev Deployment: [Vercel](https://vercel.com/)
- Prod Deployment: [AWS](https://amazonaws.com)

## How do I deploy this to Prod?

Steps:

1. Access
   Get access to this repo (Statsplex/newt) and share it with vercel. vercel will automatically pick the right deployment stategy. Copy paste all variable from .env
   Get permission to AWS. install AWS CLI and log in using the following command:

```bash
aws configure
```

2. Configure
   Setup the right SSL for the deployment target inside .env

- The SSL path for DATABASE_URL for AWS is sslcert=/etc/pki/tls/certs/ca-bundle.crt
- The SSL path for DATABASE_URL for Vercel is sslcert=/etc/ssl/certs/ca-certificates.crt

3. Deploy
   On vercel, merging code to `main` branch triggers CI for lint, test and deploy.
   On AWS, we can the following command from anyother branch

```Bash
npx sst deploy --stage prod
```

## Note

This is private repo as indicated in package.json:

```json
"private": true,
```

double check versioning and add licence before making it public
