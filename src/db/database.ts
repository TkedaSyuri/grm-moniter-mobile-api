import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import 'dotenv/config'

const connectionString =process.env.DATABASE_URL

//DrizzleとSupabaseを接続
const client = postgres(connectionString!, { prepare: false })
export const db = drizzle(client);

        