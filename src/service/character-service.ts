import type { NewCharacter } from "../db/model.js";
import {selectCharacterFromAccount, deleteCharacterById, insertCharacter, updateAccountCharacterId} from '../db/character-repository.js'

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

    // insert character + update account character.
    const insertedCharacter = await insertCharacter(newCharacter);

    //delete existing character: 
    selectCharacterFromAccount(accountId).then( (oldCharacter) => { // find character belonging to account
        updateAccountCharacterId(accountId, insertedCharacter[0].id); // update account.character_id
        deleteCharacterById( oldCharacter.id )
    });
}


