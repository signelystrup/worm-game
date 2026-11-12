import express, { type Request, type Response } from 'express';
import db from '../db/connection.js';

import { character } from '../../drizzle/schema.js';
import type { saveGameDTO } from '../dto/saveDTO.js';
import { Validator } from '../repository/save-repository.js';


const router = express.Router()


//router routes
router.post('/saves', async (req, res) => {
    const saveGameDTO: saveGameDTO = req.body

    if (Validator(saveGameDTO, res) !== true) {
        return; 
    }
    await db.transaction(async (tx) => {
    tx.insert(character)
    })
})


//need to export, should be the final line. 
export default router