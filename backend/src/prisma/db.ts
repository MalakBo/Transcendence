import 'dotenv/config';
import postgres from '@prisma/orm-postgres/runtime';
// loads typescript type information describing the database structure
import type { Contract } from './contract.d';
// loads the generated contract that prisma uses to understand the tables and supported operations
import contractJson from './contract.json' with { type: 'json' };
// it creates the databases access object named db
export const db = postgres<Contract>({
  contractJson,
  url: process.env['DATABASE_URL']!,
});
