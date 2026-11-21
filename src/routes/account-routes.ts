import express, { type Express, type Request, type Response } from 'express';
import { findAccountById, createNewAccount, updateAccount } from '../service/account-service.js';
import type { NewAccountDTO, SimpleAccountDTO, UpdateAccountDTO } from '../dto/account-dto.js';

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
    const accountDTO: {email: string, password: string, username: string }= req.body;

    createNewAccount(accountDTO.email, accountDTO.password, accountDTO.username).then( (dbAccount) => {
        res.status(200).send( {msg: "created account with email: " + dbAccount[0].email});
    }).catch(error => {
        res.status(400).send(error);
    });
});

router.put('/', async (req: Request, res: Response)  => {
    const accountDTO: UpdateAccountDTO = req.body;

    updateAccount(accountDTO).then( () => 
        res.status(200).send( {msg: "account updated"})
    ).catch( (error)=> 
        res.status(400).send({error: "failed to update account with id: " + req.params.id +  "\nerror: " + error })
    );
});

router.delete('/:id', async (req: Request<{ id: number}>, res: Response)  => {
    res.send({ data: 'DELETE account with id: ' + req.params.id  })

});

export default router