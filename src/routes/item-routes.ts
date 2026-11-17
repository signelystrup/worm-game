import express from 'express'
import * as helpers from './route-helper-functions.js'
import type { itemOptions } from '../dto/item-dto.js';
import { getItems } from '../repository/item-repository.js';

//just like app we define it with express in order to have it run the api 
const router = express()

//router routes
router.get('/', (req, res) => {
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
  console.log(options)

  getItems(options).then((items) => {
    
    res.send({ data: items });
  });

  // returns true if acending, and false for decending
  function getSortDirection(value: unknown) : boolean {
    if (typeof value !== "string")
      return true;
    if (value === "dec" || value === "decending" || value === "0" || value === "false")
      return false;
    return true;
  };
});




//need to export, should be the final line. 
export default router