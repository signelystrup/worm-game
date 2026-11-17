import { drizzle } from 'drizzle-orm/node-postgres';
//import { eq, inArray } from "drizzle-orm";
import { item, effect } from '../../dist/drizzle/schema.js';
import type { itemOptions, itemDTO } from '../dto/item-dto.js';
import { clamp } from '../routes/route-helper-functions.js'

const db = drizzle(process.env.DATABASE_URL!);

// export async function getItems(options : itemOptions) : Promise<itemDTO[]> {
//     const items = db.select()
//                     .from(item)

//     return []
// }

import { eq, ilike, and, asc, desc } from "drizzle-orm";

export async function getItems(options: itemOptions): Promise<itemDTO[]> {

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