import { eq } from 'drizzle-orm';
import { account } from '../db/schema.js';
import db from '../db/connection.js'

import type { Account } from "../db/model.js";
import { deleteCharacterById } from './character-repository.js';



export async function selectAccountWithId(accountId: number) {
    return (await db.select()
        .from(account)
        .where(eq(account.id, accountId)))[0];
}

export async function selectAccountWithEmail(email: string) {
    return db.select()
        .from(account)
        .where(eq(account.email, email))
    .then(result => {
        return [result]
    }).catch( error => {
        return "Db query error.\n" + error; 
    });
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

    // find character associated with account
    const characterId :number | null = (await db.select()
        .from(account)
        .where(eq(account.id, accountId)))[0].characterId!;
        
    db.transaction(async (tx) => {
        // delete account
        await tx.delete(account)
            .where(eq(account.id, accountId));

        // delete associated character
        if (characterId) {
            await deleteCharacterById(characterId);
        }
    });

}


