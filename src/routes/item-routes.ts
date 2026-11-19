import express from 'express'
import * as helpers from './route-helper-functions.js'
import type { itemOptions, ItemDTO } from '../dto/item-dto.js';
import { verifyItemDTO } from '../dto/item-dto.js';
import { authenticateUser, authorizeRoles } from './middleware/auth.js';
import { createItem, getItems, getItem, updateItem, deleteItem } from '../repository/item-repository.js';

//just like app we define it with express in order to have it run the api 
const router = express()

//router routes
// create
router.post('/', authenticateUser, authorizeRoles('admin'), (req, res) => {
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

// read
router.get('/', (req, res) => {
	// get options from query
	const options : itemOptions = {
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
router.get('/:itemId', (req, res) => {
	const itemId : number = parseInt(req.params.itemId as string);
	if (isNaN(itemId)) {
		res.status(400).send({ error: 'Invalid itemId parameter' });
		return;
	}
	getItem(itemId).then((items)=>
	{
		if (items.length !== 0)
			res.status(200).send({ item: items[0] })
		else
			res.status(404).send({ error: 'No item with id: ' + itemId + ' exists'})
	})
});

// update
router.put('/:itemId', authenticateUser, authorizeRoles('admin'), (req, res) => {
	const itemId : number = parseInt(req.params.itemId as string);
	if (isNaN(itemId)) {
		res.status(400).send({ error: 'Invalid itemId parameter' });
		return;
	}
	const updatedItem = req.body as ItemDTO;
	if (!verifyItemDTO(updatedItem))
	{
		res.status(400).send({ error: 'Item formatted incorrectly' });
		return;
	}
	updateItem(itemId, updatedItem).then(()=> {
		res.status(200).send();
	})
});

// delete
router.delete('/:itemId', authenticateUser, authorizeRoles('admin'), (req, res) => {
	const itemId : number = parseInt(req.params.itemId as string);
	if (isNaN(itemId)) {
		res.status(400).send({ error: 'Invalid itemId parameter' });
		return;
	}
	deleteItem(itemId).then((items)=> {
		if (items.length !== 0)
			res.status(200).send({ data: 'Item deleted' });
		else
			res.status(404).send({ error: 'There were no items, with the given id' });
	});
});



//need to export, should be the final line. 
export default router