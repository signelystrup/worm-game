import express, { type Express, type Request, type Response } from 'express';

const router: Express = express();
router.use(express.json());

router.get('/:accountId', async (req: Request, res: Response)  => {
    res.send({ data: 'GET account with id: ' + req.params.accountId })
});


router.post('/', async (req: Request, res: Response)  => {
    res.send({ data: 'POST new account ' })
});

router.put('/:accountId', async (req: Request, res: Response)  => {
    res.send({ data: 'PUT account with id: ' + req.params.accountId })

});

router.delete('/:accountId', async (req: Request, res: Response)  => {
    res.send({ data: 'DELETE account with id: ' + req.params.accountId })

});

