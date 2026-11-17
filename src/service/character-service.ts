import type { NewCharacter } from "../db/model.js";
import {selectCharacterWithId, selectCharacterFromAccount, deleteCharacterById, insertCharacterWithAccount, updateAccountCharacterId} from '../db/character-repository.js'
function createNewCharacter(accountId: number, name: string, archetypeId: number) {
    // find character belonging to account:

    //if account has character: delete character

    //create new character with name and archetype

    const newCharacter: NewCharacter = { name: name, archetypeId: archetypeId, weaponId: 1, hostile: false, spriteUrl: "path" };
    
    //await insertUser(newCharacter);
}


