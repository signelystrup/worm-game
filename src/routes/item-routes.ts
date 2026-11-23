import express from 'express'
import type { Request } from 'express'
import type { ItemDTO } from '../dto/item-dto.js';
import { createItemInDatabase, updateItemInDatabase } from '../service/item-service.js';

const router = express();
router.use(express.json());

// create
// todo: add auth 
router.post('/', (req, res) => {
	const newItem = req.body as ItemDTO;
	createItemInDatabase(newItem).then((itemIds)=>{
		if (itemIds && itemIds.length !== 0)
			res.status(201).location("api/items/" + itemIds[0].id.toString()).send();
		else
			res.status(400).send({ Error: 'Data formatted incorrectly' });
	})
});



// update
// todo: add auth
router.put('/:itemId', (req : Request<{ itemId : number }>, res) => {
	const itemId = req.params.itemId;
	if (isNaN(itemId)) {
		res.status(400).send({ error: 'Invalid itemId parameter' });
		return;
	}
	const updatedItem = req.body as ItemDTO;
	updateItemInDatabase(itemId, updatedItem).then(()=> {
		res.status(200).send({ data: "Item updated." })
	});
});

export default router;
