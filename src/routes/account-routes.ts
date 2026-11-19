import express, { type Express, type Request, type Response } from 'express';
import { findAccountById, updateAccount } from '../service/account-service.js';
import type { SimpleAccountDTO, UpdateAccountDTO } from '../dto/account-dto.js';

const router: Express = express();
router.use(express.json());

router.get('/:id', async (req: Request<{ id: number}>, res: Response)  => {
    const accountDTO: SimpleAccountDTO = await findAccountById(req.params.id);    
    res.send(accountDTO);
});

router.post('/', async (req: Request, res: Response)  => {
    res.send({ data: 'POST new account ' })
});

router.put('/:id', async (req: Request<{ id: number}>, res: Response)  => {
    const accountDTO: UpdateAccountDTO = req.body;
    updateAccount(accountDTO);

    res.send({ data: 'PUT account with id: ' + req.params.id })
});

router.delete('/:id', async (req: Request<{ id: number}>, res: Response)  => {
    res.send({ data: 'DELETE account with id: ' + req.params.id })

});

export default router