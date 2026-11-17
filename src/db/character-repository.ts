import { eq, lt, gte, ne } from 'drizzle-orm';

import type { NewCharacter } from './model.js';
import db from './connection.js'
import {character, account} from '../../drizzle/schema.js'


export async function selectCharacterWithId(characterId: number) {
  const result = await db.select().from(character).where(eq(character.id, characterId) );
  return result[0];
}

export async function selectCharacterFromAccount(accountId: number) {
  const accountResult = await db.select( {characterId: account.characterId} ).from(account).where(eq(account.id, accountId)); //findn account + characterId
  const characterResult = await db.select().from(character).where(eq(character.id, accountResult[0].characterId) ); // select character, with same id as account.character_id
  
  return characterResult[0];
}

export async function deleteCharacterById (characterId: number) {
    await db.delete(character).where(eq(character.id, characterId)); 
}

export async function insertCharacterWithAccount (accountId: number, newCharacter: NewCharacter) {
    return db.insert(character).values(newCharacter);
}

export async function updateAccountCharacterId(accountId: number, characterId: number) {

}


