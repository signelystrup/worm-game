import express, { type Request, type Response } from 'express';

const router = express.Router({ caseSensitive: true, strict: true });

router.get('/', (req: Request, res: Response) => {
  res.send({ data: 'hello from the character router' });
});


export default router;
