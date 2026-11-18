import express, { type Express, type Request, type Response } from 'express';

import {createNewPlayerCharacter} from '../service/character-service.js';

const router: Express = express();
router.use(express.json());

router.get('/', (req: Request, res: Response) => {
  res.send({ data: 'hello from the character router' });
});

router.post('/', (req: Request, res: Response)  => {
    const body: {accountId: number, archetypeId: number, characterName: string} = req.body;
    
    createNewPlayerCharacter(body.accountId, body.characterName, body.archetypeId);

    res.send(`status: ${req.statusCode}, body: ${body.characterName}`);


});


export default router;
