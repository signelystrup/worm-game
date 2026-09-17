import express from 'express'

//just like app we define it with express in order to have it run the api 
const router = express()

//router routes
router.get('/example-routes', (req, res) => {
  res.send({ data: 'hello from the example router' })
})


//need to export, should be the final line. 
export default router