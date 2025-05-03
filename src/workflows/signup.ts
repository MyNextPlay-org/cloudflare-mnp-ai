import { WorkflowEntrypoint, WorkflowStep, WorkflowEvent } from "cloudflare:workers";
import { Resend } from "resend";
import { upsertMagicToken } from "../models/user";

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
      console.log(email, token, expires);
      await upsertMagicToken(this.env, email, token, expires);
    });

    // 2) Send email
    await step.do("send verification email", async () => {
      // build the magic-link off of the passed origin
      const link = `${origin}/verify?token=${token}`;
      const resend = new Resend(this.env.RESEND_API_KEY);
      try {
        await resend.emails.send({
          from: "no-reply@dropsite.dev",
          to: email,
          subject: "Verify your email",
          html: `<p>Click to verify: ${link}</p>`,
        });
      } catch (err) {
        console.error("Failed to send verification email:", err);
        throw err;
      }
    });
  }
}
