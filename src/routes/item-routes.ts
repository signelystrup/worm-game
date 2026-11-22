import express from 'express'
import type { Request } from 'express'
import { clamp } from '../helpers/route-helper-functions.js'
import type { ItemDTO, ItemOptions } from '../dto/item-dto.js';
import { createItemInDatabase, readItemsFromDatabase, readItemByIdFromDatabase } from '../service/item-service.js';

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

// read
router.get('/', (req : Request<{}, {}, {}, { page? : number, 
											 pageSize? : number, 
											 sortBy? : string, 
											 sortDirection? : string,
											 filterName? : string,
											 filterDescription? : string }>, res) => {
	// get options from query
	const options : ItemOptions = {
		// Pagination
		itemPage: Math.max(req.query.page ?? 1, 1),
		itemPageSize: clamp(req.query.pageSize ?? 1, 1, 100),
		
		// Sorting
		itemSort: {
			sortBy: req.query.sortBy ?? "",
			ascending: getSortDirection(req.query.sortDirection)
		},

		// Filtering
		itemFilter: {
			name: req.query.filterName ?? "",
			description: req.query.filterDescription ?? "",
		},
	}

	// get items from db
	readItemsFromDatabase(options).then((items) => {
		res.send({ data: items });
	});

	// helper function for sort direction
	// returns true if acending, and false for decending
	function getSortDirection(value: string | undefined) : boolean {
		if (typeof value !== "string")
			return true;
		if (value === "dec" || value === "decending" || value === "0" || value === "false")
			return false;
		return true;
	};
});

// read one item
router.get('/:itemId', (req: Request<{ itemId: number }>, res) => {
	const itemId : number = req.params.itemId;
	readItemByIdFromDatabase(itemId).then((items)=> {
		if (items.length !== 0)
			res.status(200).send({ item: items[0] })
		else
			res.status(404).send({ error: 'No item with id: ' + itemId + ' exists'})
	})
});


export default router;
