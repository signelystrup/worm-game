import type { NewCharacter } from "../db/model.js";
import {selectCharacterFromAccount, deleteCharacterById, insertCharacter, updateAccountCharacterId} from '../db/character-repository.js'

export function createNewPlayerCharacter(accountId: number, name: string, archetypeId: number) {
    //delete existing character: 
    selectCharacterFromAccount(accountId).then( (oldCharacter) => {// find character belonging to account
        deleteCharacterById( oldCharacter.id )
    });

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

    // insert character + update account id.
    insertCharacter(newCharacter).then( newCharacter => {
        updateAccountCharacterId(accountId, newCharacter[0].id); // update account.character_id
    });
}


