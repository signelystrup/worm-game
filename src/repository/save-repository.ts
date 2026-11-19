import db from "../db/connection.js"
import {character, characterStage, inventory, inventoryItem, levelUpBonus} from "../../drizzle/schema.js"
import type { saveGameDTO } from "../dto/saveDTO.js";
import { and, eq } from "drizzle-orm";


export async function saveCharacter(dto: saveGameDTO) {
    // start transaction 
    await db.transaction(async (tx) => {
    //give charachter their current weapon 
    await tx.update(character)
        .set({ weaponId: dto.weaponId })
        .where(eq(character.id, dto.characterId));
    //give charecter a inventory in case they dont have one. in case they all have one do nothing. 
    await tx.insert(inventory)
        .values({ characterId: dto.characterId })
        .onConflictDoNothing();
    //delete contents of old inventory
    await tx.delete(inventoryItem)
        .where(eq(inventoryItem.inventoryId, dto.inventoryid));
    //if they have anything in their inventory then replace it with the current inventory of items
    if (dto.inventory.length > 0) {
        await tx.insert(inventoryItem).values(
            dto.inventory.map(item => ({
            itemId: item.itemId,
            inventoryId: dto.inventoryid,
            amount: item.amount,
            }))
        );
        //add level up bonus to the characher 
        await tx.insert(levelUpBonus).values({
            characterId: dto.characterId,
            talentId: dto.levelup.talentId,
            statId: dto.levelup.statId,
        });
    }
    
    //update the characterStage so the one we were just one is completed and we can move on to the next 
    await tx.update(characterStage)
        .set({ completed: true })
        .where(
        and(
        eq(characterStage.characterId, dto.characterId),
        eq(characterStage.stageId, dto.completedStageId)
        )
        );
    })
}   
