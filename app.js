//import express application its like springboot or axum
import express from 'express'


//keep routes and packages seperate blocks 
import exampleRoutes from './routes/example-routes.js'

//we store the express application in app so we can add to it. like routes and middlware. 
const app = express()


//routes routes get loaded in here 
app.use(exampleRoutes)


//the standard / route send as a javascript object 
// which is automatically sent as json
app.get('/', (req, res) => {
  res.send({ data: 'hello' })
})



//this should be the last route in the entire application. 
// *splat means all routes after this block results to this
app.all('/{*splat}', (req, res) => {
  res.status(404).send({ data: "Didn't match with a route" })
})


//port of the application 
const PORT = 8080

//starts the app on the port 
app.listen(PORT, () => {
  console.log('Server is running on port:', PORT)
})

//to start server type 'npm start'
