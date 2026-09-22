# Email transport behind the env

The only recovery path for a locked-out Agency account is the CMS Dashboard's forgot-password flow, which emails a reset link built from `serverURL`. Payload sends that email through the adapter wired into `buildConfig.email` — with none wired it silently falls back to an ethereal test account, so the email never arrives and the account stays locked. The provider (SMTP or a transactional service) is the Agency's call and may change, so the app must not hardcode one.

## Decision

- `serverURL` comes from `NEXT_PUBLIC_SERVER_URL`, validated as a URL in `src/env.ts`: no trailing slash (reset links would carry doubled separators), and `https://` required when `NODE_ENV` is production — admin sessions already use Secure cookies, which browsers reject over plain HTTP, so an http URL would break login outright.
- Exactly one email provider is required, decided by which env vars are set (mirroring the R2 pattern of docs/adr/0002): `SMTP_HOST` + `SMTP_PORT` (credentials `SMTP_USER`/`SMTP_PASS` both-or-neither) wire `@payloadcms/email-nodemailer`; `RESEND_API_KEY` wires `@payloadcms/email-resend`. Setting both, neither, or SMTP without a port fails validation at boot. `src/email.ts` builds the adapter args; `emailAdapterOf` picks the provider.
- Local dev does not use an external provider: a Mailpit container in `compose.yaml` (SMTP on 1025, web UI on 8025) catches everything sent from `SMTP_HOST=localhost`, making the reset email inspectable and the reset link clickable.
- `EMAIL_FROM_ADDRESS`/`EMAIL_FROM_NAME` are always required; the address must survive email validation, so local dev uses the reserved `feugee.test` domain rather than a bare hostname.

## Consequences

- All CMS-sent mail (today only reset emails) flows through the chosen provider; switching providers is an env change, not a deploy change. Adding a third provider means a new adapter branch plus a schema rule in `src/env.ts`.
- The nodemailer adapter verifies the SMTP transport at boot but only logs failures — an unreachable mail server warns in the logs instead of blocking the app.
- Payload's ethereal fallback can never silently engage, because the schema refuses to boot without a provider.
