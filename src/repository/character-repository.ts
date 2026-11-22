import { eq, lt, gte, ne } from 'drizzle-orm';

import type { NewCharacter } from '../db/model.js';
import db from '../db/connection.js'
import {character, account, inventory} from './../db/schema.js'; //'../../drizzle/schema.js'

// returns character with given id
export async function selectCharacterWithId(characterId: number) {
  const result = await db.select().from(character).where(eq(character.id, characterId) );
  return result[0];
}

// return character belonging to a given account
export async function selectCharacterFromAccount(accountId: number) {
  const accountResult = await db.select( {characterId: account.characterId} )
    .from(account)
    .where(eq(account.id, accountId)); //findn account + characterId
  
  const characterResult = await db.select()
    .from(character)
    .where(eq(character.id, accountResult[0].characterId) ); // select character, with same id as account.character_id
  
  return characterResult[0];
}

// deletes character with given id.
export async function deleteCharacterByIdAndUpdateAccount (oldCharacterId: number, newCharacterId: number) {
    db.transaction(async (tx) => {


      // update character on account
      await tx.update(account)
        .set( {characterId: newCharacterId})
        .where(eq(account.characterId, oldCharacterId));

      //delete character
      await tx.delete(character)
        .where(eq(character.id, oldCharacterId)); 
      await tx.delete(inventory) //inventory
        .where(eq(inventory.characterId, oldCharacterId)); 
    });
}

// Insert new character
export async function insertCharacter (newCharacter: NewCharacter) {
    return db.insert(character)
        .values(newCharacter).returning();
}

// Update character belonging to existing account
export async function updateAccountCharacterId(accountId: number, characterId: number) {
    return db.update(account)
        .set( {characterId: characterId})
        .where(eq(account.id, accountId));
}


