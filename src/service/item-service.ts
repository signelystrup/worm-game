import { createItem } from '../repository/item-repository.js';
import type { ItemDTO } from '../dto/item-dto.js';
import { verifyItemDTO } from '../dto/item-dto.js';

export function createItemInDatabase(newItem: ItemDTO): Promise<{id: number}[] | null> {
	if (!verifyItemDTO(newItem))
		return Promise.resolve(null);
	
    return createItem(newItem);
}