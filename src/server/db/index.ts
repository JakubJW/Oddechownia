import { drizzle, PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import { env } from '@/env';

const connectionString = env.NEXT_DATABASE_URL;

export const client = postgres(connectionString, { prepare: false });
export const drizzleClient = drizzle(client, {
  schema,
});

declare global {
  var database: PostgresJsDatabase<typeof schema> | undefined;
}

export const db = global.database || drizzleClient;
if (env.NODE_ENV !== 'production') global.database = db;
