import { drizzle } from 'drizzle-orm/node-postgres';
import { item, effect, inventoryItem, stageTile } from '../../dist/drizzle/schema.js';
import type { itemOptions, ItemDTO } from '../dto/item-dto.js';
import { clamp } from '../routes/route-helper-functions.js'
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

export async function getItems(options: itemOptions): Promise<ItemDTO[]> {

    // Filtering
    const conditions = [];

    if (options.itemFilter.name) {
        conditions.push(ilike(item.name, `%${options.itemFilter.name}%`));
    }

    if (options.itemFilter.description) {
        conditions.push(ilike(item.description, `%${options.itemFilter.description}%`));
    }

    // Sorting
    const sortColumns = {
        name: item.name,
        description: item.description,
    };

    const sortColumn = sortColumns[
        options.itemSort.sortBy as keyof typeof sortColumns
    ] ?? item.name;

    const sortDirection = options.itemSort.ascending
        ? asc(sortColumn)
        : desc(sortColumn);

    // Pagination
    const page = Math.max(1, options.itemPage);
    const pageSize = clamp(options.itemPageSize, 1, 999);
    const offset = (page - 1) * pageSize;

    // Query
    const items = await db.select({
        id: item.id,
        name: item.name,
        description: item.description,
        spriteUrl: item.spriteUrl,
        effect: {
            id: effect.id,
            name: effect.name,
            description: effect.description,
            duration: effect.duration,
            strength: effect.strength,
        }
    })
        .from(item)
        .where(and(...conditions))
        .leftJoin(effect, eq(item.effectId, effect.id))
        .orderBy(sortDirection)
        .limit(pageSize)
        .offset(offset);

    return items;
}

export async function getItem(itemId : number): Promise<ItemDTO[]> {
    return await db.select({
        id: item.id,
        name: item.name,
        description: item.description,
        spriteUrl: item.spriteUrl,
        effect: {
            id: effect.id,
            name: effect.name,
            description: effect.description,
            duration: effect.duration,
            strength: effect.strength,
        }
    })
        .from(item)
        .where(eq(item.id, itemId))
        .leftJoin(effect, eq(item.effectId, effect.id))
}

// transaction that deletes an item of a given id, along with any inventoryItem and stageTile that refers to it
export async function deleteItem(itemId: number) {
    return await db.transaction(async (tx) => {
        await tx.delete(inventoryItem)
            .where(eq(inventoryItem.itemId, itemId));

        await tx.delete(stageTile)
            .where(eq(stageTile.itemId, itemId));

        return await tx.delete(item)
            .where(eq(item.id, itemId))
            .returning();
    });
}