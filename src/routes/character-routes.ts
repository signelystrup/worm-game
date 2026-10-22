import express, { type Request, type Response } from 'express';

const router = express.Router({ caseSensitive: true, strict: true });

router.use(express.json());

router.get('/', (req: Request, res: Response) => {
  res.send({ data: 'hello from the character router' });
});

router.post('/', (req: Request, res: Response)  => {
    const body: {accountId: number, archetypeId: number, characterName: String} = req.body;

    res.send(`status: ${req.statusCode}, body: ${body.characterName}`);


});

/*
router.param('id', (req: Request, res: Response, next: NextFunction, id: string) => {
  console.log('CALLED ONLY ONCE');
  next();
});
*/

export default router;
