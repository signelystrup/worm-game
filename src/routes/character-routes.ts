import express, { type Express, type Request, type Response } from 'express';

import {createNewPlayerCharacter} from '../service/character-service.js';

const router: Express = express();
router.use(express.json());

router.post('/', async (req: Request, res: Response)  => {
    const body: {accountId: number, archetypeId: number, characterName: string} = req.body;
    
    await createNewPlayerCharacter(body.accountId, body.characterName, body.archetypeId);

    res.status(200).send(`body: ${body.characterName}`);


});

export default router;
