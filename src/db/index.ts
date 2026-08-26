import * as dns from "node:dns";
dns.setDefaultResultOrder("ipv4first");

import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required");
}

const globalForDb = globalThis as typeof globalThis & {
  __arenaNextJsPostgresqlPool?: Pool;
};

export const pool =
  globalForDb.__arenaNextJsPostgresqlPool ??
  new Pool({
    connectionString: databaseUrl,
    // Supabase's pooler presents a cert chain that Node's default CA
    // store won't fully validate (SELF_SIGNED_CERT_IN_CHAIN). The
    // connection itself is still encrypted — this just skips strict
    // chain verification, which is the standard approach for Supabase's
    // pgbouncer pooler from serverless platforms like Vercel.
    ssl: { rejectUnauthorized: false },
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.__arenaNextJsPostgresqlPool = pool;
}

export const db = drizzle(pool, { schema });
