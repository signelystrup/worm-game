import express, { type Express, type Request, type Response } from 'express';

import { selectAccountWithEmail } from "../repository/account-repository.js";

const router: Express = express();
router.use(express.json());

router.post('/login', async (req: Request, res: Response)  => {
    const email: string = req.body.email;

    selectAccountWithEmail(req.body.email);

});

export default router;


