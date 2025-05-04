import { Kysely } from "kysely";
import { D1Dialect } from "kysely-d1";
import { User } from "../models/user";
import { Document } from "../models/document";

export interface Database {
  users: User;
  documents: Document;
}

// Reuse your Env type (the Worker binding with `.DB`)
export function getDb(env: Env): Kysely<Database> {
  return new Kysely({
    dialect: new D1Dialect({ database: env.DB }),
  });
}
