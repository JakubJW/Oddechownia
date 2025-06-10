import { drizzle, PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import * as relations from './relations';
import { env } from '../../env';

const connectionString = env.NEXT_DATABASE_URL;

// Disable prefetch as it is not supported for "Transaction" pool mode
export const client = postgres(connectionString, { prepare: false });
export const drizzleClient = drizzle(client, {
  schema: { ...schema, ...relations },
});

declare global {
  var database:
    | PostgresJsDatabase<typeof schema & typeof relations>
    | undefined;
}

export const db = global.database || drizzleClient;
if (env.NODE_ENV !== 'production') global.database = db;
