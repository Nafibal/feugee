import type { NodemailerAdapterArgs } from "@payloadcms/email-nodemailer"
import { nodemailerAdapter } from "@payloadcms/email-nodemailer"
import type { ResendAdapterArgs } from "@payloadcms/email-resend"
import { resendAdapter } from "@payloadcms/email-resend"
import type { EmailAdapter } from "payload"

import type { Env } from "./env"

export type EmailProvider = "smtp" | "resend"

export function emailProviderOf(env: Env): EmailProvider {
  return env.SMTP_HOST ? "smtp" : "resend"
}

/**
 * The args are meant for the SMTP env shape only — the schema guarantees
 * SMTP_HOST and SMTP_PORT are present together, so the guard narrows the
 * optional fields for TypeScript rather than defending against real input.
 */
export function nodemailerArgsOf(env: Env): NodemailerAdapterArgs {
  if (!env.SMTP_HOST || !env.SMTP_PORT) {
    throw new Error("nodemailerArgsOf requires the SMTP env shape")
  }

  return {
    defaultFromAddress: env.EMAIL_FROM_ADDRESS,
    defaultFromName: env.EMAIL_FROM_NAME,
    transportOptions: {
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      ...(env.SMTP_USER && env.SMTP_PASS
        ? { auth: { user: env.SMTP_USER, pass: env.SMTP_PASS } }
        : {}),
    },
  }
}

export function resendArgsOf(env: Env): ResendAdapterArgs {
  if (!env.RESEND_API_KEY) {
    throw new Error("resendArgsOf requires the Resend env shape")
  }

  return {
    apiKey: env.RESEND_API_KEY,
    defaultFromAddress: env.EMAIL_FROM_ADDRESS,
    defaultFromName: env.EMAIL_FROM_NAME,
  }
}

export async function emailAdapterOf(env: Env): Promise<EmailAdapter> {
  return emailProviderOf(env) === "smtp"
    ? nodemailerAdapter(nodemailerArgsOf(env))
    : resendAdapter(resendArgsOf(env))
}
