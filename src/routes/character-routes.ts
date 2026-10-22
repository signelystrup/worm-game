import express from 'express';

const router = express();

router.get('/', (req, res) => {
  res.send({ data: 'hello from the character router' });

});



export default router;
