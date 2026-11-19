import {character, account} from '../../dist/drizzle/schema.js';

export type NewCharacter = typeof character.$inferInsert;
export type Account = typeof account.$inferInsert;






