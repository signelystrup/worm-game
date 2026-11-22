import { createItem, getItem, getItems } from '../repository/item-repository.js';
import type { ItemDTO, ItemOptions } from '../dto/item-dto.js';
import { verifyItemDTO } from '../dto/item-dto.js';

export function createItemInDatabase(newItem: ItemDTO): Promise<{id: number}[] | null> {
	if (!verifyItemDTO(newItem))
		return Promise.resolve(null);
	
    return createItem(newItem);
}

export function readItemsFromDatabase(options: ItemOptions): Promise<ItemDTO[]> {
    return getItems(options);
}

export function readItemByIdFromDatabase(id : number): Promise<ItemDTO[]> {
    return getItem(id);
}