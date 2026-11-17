import express, { type Request, type Response } from 'express';
import { getFullStage } from '../repository/stageRepository.js';

const router = express.Router();


router.get('/:stageId', (req: Request, res: Response) => {
  const stageId : number = parseInt(req.params.stageId as string);
  if (isNaN(stageId)) {
    res.status(400).send({ error: 'Invalid stageId parameter' });
    return;
  }
  getFullStage(stageId).then((stage) => {
    if (!stage) {
      res.status(404).send({ error: 'Stage does not exist' });
      return;
    }
    
    res.send({ data: stage });
  });
});

export default router;