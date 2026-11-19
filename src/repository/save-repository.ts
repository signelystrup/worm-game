import db from "../db/connection.js"
import {character, characterStage, inventory, inventoryItem, levelUpBonus} from "../../drizzle/schema.js"
import type { saveGameDTO } from "../dto/saveDTO.js";
import { and, eq } from "drizzle-orm";


export async function saveCharacter(dto: saveGameDTO) {
        await db.transaction(async (tx) => {
            await tx.update(character)
                .set({ weaponId: dto.weaponId })
                .where(eq(character.id, dto.characterId));

            await tx.insert(inventory)
                .values({ characterId: dto.characterId })
                .onConflictDoNothing();
            
            await tx.delete(inventoryItem)
            .where(eq(inventoryItem.inventoryId, dto.inventoryid));
        
            if (dto.inventory.length > 0) {
            await tx.insert(inventoryItem).values(
                dto.inventory.map(item => ({
                    itemId: item.itemId,
                    inventoryId: dto.inventoryid,
                    amount: item.amount,
                }))
            );
            
            await tx.insert(levelUpBonus).values({
                characterId: dto.characterId,
                talentId: dto.levelup.talentId,
                statId: dto.levelup.statId,
            });
        }
    

        await tx.insert(characterStage).values({
            characterId: dto.characterId,
            stageId: dto.completedStageId,
            completed: true,
            startX: 0, 
            startY: 0,
        })

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