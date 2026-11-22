import express from 'express'
import type { Request } from 'express'
import * as helpers from '../helpers/route-helper-functions.js'
import type { ItemDTO, ItemOptions } from '../dto/item-dto.js';
import { getItem, getItems } from '../repository/item-repository.js';
import { createItemInDatabase } from '../service/item-service.js';

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
router.get('/', (req, res) => {
	// get options from query
	const options : ItemOptions = {
		// Pagination
		itemPage: Math.max(helpers.getQueryInt(req.query.page, 0), 1),
		itemPageSize: helpers.clamp(helpers.getQueryInt(req.query.pageSize, 10), 1, 100),
		// Sorting
		itemSort: {
			sortBy: helpers.getQueryString(req.query.sortBy, ""),
			ascending: getSortDirection(req.query.sortDirection)
		},

		// Filtering
		itemFilter: {
			name: helpers.getQueryString(req.query.filterName, ""),
			description: helpers.getQueryString(req.query.filterDescription, ""),
		},
	}

	// get items from db
	getItems(options).then((items) => {
		res.send({ data: items });
	});

	// helper function for sort direction
	// returns true if acending, and false for decending
	function getSortDirection(value: unknown) : boolean {
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
	getItem(itemId).then((items)=>
	{
		if (items.length !== 0)
			res.status(200).send({ item: items[0] })
		else
			res.status(404).send({ error: 'No item with id: ' + itemId + ' exists'})
	})
});


export default router;
