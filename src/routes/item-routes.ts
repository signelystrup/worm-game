import express from 'express'
import type { ItemDTO } from '../dto/item-dto.js';
import { verifyItemDTO } from '../dto/item-dto.js';
import { createItem } from '../repository/item-repository.js';

const router = express();
router.use(express.json());

// create
// todo: add auth 
router.post('/', (req, res) => {
	const newItem = req.body as ItemDTO;
	if (!verifyItemDTO(newItem))
	{
		res.status(400).send({ error: 'Item formatted incorrectly' });
		return;
	}
	createItem(newItem).then((itemIds)=>{
		if (itemIds && itemIds.length !== 0)
			res.status(201).location("api/items/" + itemIds[0].id.toString()).send();
		else
			res.status(400).send({ Error: 'Data formatted incorrectly' });
	})
});

export default router;
