import express from 'express'
import * as helpers from './route-helper-functions.js'
import type { itemOptions } from '../dto/item-dto.js';
import { getItems, deleteItem } from '../repository/item-repository.js';
import { authenticateUser, authorizeRoles } from './middleware/auth.js';

//just like app we define it with express in order to have it run the api 
const router = express()

//router routes
// create

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

// update

// delete
router.delete('/:itemId', authenticateUser, authorizeRoles('admin'), (req, res) => {
  const itemId : number = parseInt(req.params.itemId as string);
  if (isNaN(itemId)) {
    res.status(400).send({ error: 'Invalid itemId parameter' });
    return;
  }
  deleteItem(itemId).then((items)=> {
    if (items.length == 0)
      res.status(204).send({ msg: 'There were no items, with the given id' });
    else
      res.status(200).send({ msg: 'Item deleted' });
  });
});



//need to export, should be the final line. 
export default router