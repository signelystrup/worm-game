import express, { type Request, type Response } from 'express';
import db from '../db/connection.js';

import type { saveGameDTO } from '../dto/saveDTO.js';
import { Validator } from '../service/save-service.js';
import { saveCharacter } from '../repository/save-repository.js';



const router = express.Router()


//router routes
router.post('/api/saves', async (req, res) => {
    console.log(req.body)
    if (!req.body) {
        return res.status(400).json({ 
            success: false, 
            message: "Request body is missing" 
        });
    }

    const saveGameDTO: saveGameDTO = req.body

    if (Validator(saveGameDTO, res) !== true) {
        return; 
    }

    try {
        await saveCharacter(saveGameDTO);

        return res.status(200).json({ 
            success: true, 
            message: "Game saved" 
        });

    } catch (error) {
        console.error("Error saving game:", error);


        return res.status(500).json({ 
            success: false, 
            message: "server error" 
        });
    }
})


//need to export, should be the final line. 
export default router