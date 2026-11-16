import express, { type Request, type Response } from 'express';
import { getFullStage } from '../repository/stageRepository.js';

const router = express.Router();


router.get('/:stageId', (req: Request, res: Response) => {
  const stageId : number = parseInt(req.params.stageId as string);
  getFullStage(stageId).then((stage) => {
    res.send({ data: stage });
  });
});

export default router;