import { VectorizeIndex } from "@cloudflare/workers-types";

export interface Env {
  DB: D1Database;
  ASSETS: Fetcher;
  NODE_ENV: string;
  SIGNUP_WORKFLOW: any;
  SEND_EMAIL: any;
  VECTORIZE: VectorizeIndex;
  AI: any;
}
