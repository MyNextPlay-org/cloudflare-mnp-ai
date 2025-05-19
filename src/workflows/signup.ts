import { WorkflowEntrypoint, WorkflowStep, WorkflowEvent } from "cloudflare:workers";
import { Resend } from "resend";
import { upsertMagicToken } from "@/models/user";

type Params = {
  email: string;
  origin: string;
};

export class SignupWorkflow extends WorkflowEntrypoint<Env, Params> {
  async run(event: WorkflowEvent<Params>, step: WorkflowStep) {
    const { email, origin } = event.payload;

    // 1) Generate & store a magic token (expires in 15m)
    const token = crypto.randomUUID();
    const expires = new Date(Date.now() + 15 * 60e3).toISOString();
    await step.do("store magic token", async () => {
      try {
        await upsertMagicToken(this.env, email, token, expires);
      } catch (err) {
        console.error("[SignupWorkflow] Failed to store magic token:", err);
        throw err;
      }
    });

    // 2) Send email
    await step.do("send verification email", async () => {
      const link = `${origin}/verify?token=${token}`;
      const resend = new Resend(this.env.RESEND_API_KEY);
      try {
        await resend.emails.send({
          from: "no-reply@mynextplay.ai",
          to: email,
          subject: "Verify your email",
          html: `<p>Click to verify: ${link}</p>`,
        });
      } catch (err) {
        console.error("[SignupWorkflow] Failed to send verification email:", err);
        throw err;
      }
    });
  }
}
