import { eq } from 'drizzle-orm';
import { account } from '../../dist/drizzle/schema.js';
import db from '../db/connection.js'

import type { Account } from "../db/model.js";
import { deleteCharacterById } from './character-repository.js';



export async function selectAccountWithId(accountId: number) {
    return await db.select()
        .from(account)
        .where(eq(account.id, accountId));
}


export async function insertNewAccount(newAccount: Account) {
    return db.insert(account)
        .values(newAccount)
        .returning();
}

export async function updateAccount(accountId: number, updatedAccount: Account) {
    return db.update(account)
        .set( updatedAccount)
        .where(eq(account.id, accountId))
        .returning();
}

export async function deleteAccount(accountId: number) {

    db.transaction(async (tx) => {
        const characterId :number = (await tx.select()
            .from(account)
            .where(eq(account.id, accountId)))[0].characterId!;
        
        // delete account
        await tx.delete(account)
            .where(eq(account.id, accountId));

        // delete associated character
        await deleteCharacterById(characterId);
    });

}


