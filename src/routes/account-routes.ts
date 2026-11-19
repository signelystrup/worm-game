import express, { type Express, type Request, type Response } from 'express';
import { findAccountById, updateAccount } from '../service/account-service.js';
import type { SimpleAccountDTO, UpdateAccountDTO } from '../dto/account-dto.js';

const router: Express = express();
router.use(express.json());

router.get('/:id', async (req: Request<{ id: number}>, res: Response)  => {
    findAccountById(req.params.id).then(accountDTO => {
        res.status(200).send(accountDTO);
    }).catch(error => {
        res.status(400).send(error);
    });
});

router.post('/', async (req: Request, res: Response)  => {
    res.send({ data: 'POST new account ' })
});

router.put('/', async (req: Request, res: Response)  => {
    const accountDTO: UpdateAccountDTO = req.body;

    updateAccount(accountDTO).then( () => 
        res.status(200).send( {msg: "account updated"})
    ).catch( ()=> 
        res.status(400).send({error: "failed to update account with id: " + req.params.id })
    );
});

router.delete('/:id', async (req: Request<{ id: number}>, res: Response)  => {
    res.send({ data: 'DELETE account with id: ' + req.params.id })

});

export default router