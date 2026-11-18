import type { NewCharacter } from "../db/model.js";
import {selectCharacterFromAccount, deleteCharacterByIdAndUpdateAccount, insertCharacter, updateAccountCharacterId} from '../db/character-repository.js'

// creates new player character, deletes old player characters, and updates player character on account.
export async function createNewPlayerCharacter(accountId: number, name: string, archetypeId: number) {

    //create new character with name, archetype and default weapon.
    const weaponId = 1; // TODO! find archetype default weapon
    const spriteUrl = "/default/player/character/path"; // TODO!

    const newCharacter: NewCharacter = { 
        name: name, 
        archetypeId: archetypeId, 
        weaponId: weaponId, 
        hostile: false, 
        spriteUrl: spriteUrl 
    };

    // insert character 
    const newcharacterId = (await insertCharacter(newCharacter))[0].id;

    //delete existing character + update account character: 
    const oldCharacter = await selectCharacterFromAccount(accountId);
    deleteCharacterByIdAndUpdateAccount( oldCharacter.id, newcharacterId );
}


