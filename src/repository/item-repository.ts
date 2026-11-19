import { drizzle } from 'drizzle-orm/node-postgres';
import { item, effect, inventoryItem, stageTile } from '../../dist/drizzle/schema.js';
import type { ItemDTO } from '../dto/item-dto.js';
import { clamp } from '../helpers/math-helpers.js'
import { eq, ilike, and, asc, desc } from "drizzle-orm";

const db = drizzle(process.env.DATABASE_URL!);

export async function createItem(newItem: ItemDTO): Promise<{id: number}[] | null> {
    try {
        return await db.transaction(async (tx) => {
            let effectId: number | null = null;

            // Create effect first, if one exists, and not in the database
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