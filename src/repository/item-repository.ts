import { drizzle } from 'drizzle-orm/node-postgres';
import { item, effect, inventoryItem, stageTile } from '../db/schema.js';
import type { ItemDTO } from '../dto/item-dto.js';
import { clamp } from '../helpers/math-helpers.js'
import { eq, ilike, and, asc, desc } from "drizzle-orm";

const db = drizzle(process.env.DATABASE_URL!);

// create
export async function createItem(newItem: ItemDTO): Promise<{id: number}[] | null> {
    try {
        return await db.transaction(async (tx) => {
            let effectId: number | null = null;

            // Create effect first, if one exists, and isn't in the database
            if (newItem.effect) {
                if (newItem.effect.id)
                    effectId = newItem.effect.id
                else {
                    const [createdEffect] = await tx
                        .insert(effect)
                        .values({
                            name: newItem.effect.name,
                            description: newItem.effect.description,
                            duration: newItem.effect.duration,
                            strength: newItem.effect.strength,
                        })
                        .returning({ id: effect.id });

                    effectId = createdEffect.id;
                }
            }

            // Create item
            return await tx.insert(item).values({
                name: newItem.name,
                description: newItem.description,
                spriteUrl: newItem.spriteUrl,
                effectId: effectId,
            }).returning({ id: item.id});
        });
    } catch { // something wrong, likely gave an effectId not in the database.
        return null
    }
}



// update
export async function updateItem(id : number, newItemData: ItemDTO): Promise<void> {
    try {
        await db.transaction(async (tx) => {
            let effectId: number | null = null;

            // Create effect first, if one exists, and isn't in the database
            if (newItemData.effect) {
                if (newItemData.effect.id)
                    effectId = newItemData.effect.id
                else {
                    const [createdEffect] = await tx
                        .insert(effect)
                        .values({
                            name: newItemData.effect.name,
                            description: newItemData.effect.description,
                            duration: newItemData.effect.duration,
                            strength: newItemData.effect.strength,
                        })
                        .returning({ id: effect.id });

                    effectId = createdEffect.id;
                }
            }

            // update item
            await tx.update(item)
                .set({
                    name: newItemData.name,
                    description: newItemData.description,
                    spriteUrl: newItemData.spriteUrl,
                    effectId: effectId,
                })
                .where(eq(item.id, id));
        });
    } catch { // something wrong, likely gave an effectId not in the database.
    }
}