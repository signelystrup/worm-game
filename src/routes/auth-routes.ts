import express, { type Express, type Request, type Response } from 'express';

const router: Express = express();
router.use(express.json());

router.post('/login', async (req: Request, res: Response)  => {
    
});

export default router;


