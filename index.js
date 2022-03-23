const express = require('express');
const { dbConnection } = require('./database/config');
require('dotenv').config()
const cors = require('cors')



//  CREO SERVIDOR

const app = express()


//Base de datos Mongo
dbConnection()


//CORS -> api cfg para restringir las peticiones
app.use(cors())


//directorio publico
app.use( express.static('public') )


//lectura y parseo de las peticiones JSON! que vienen por body
app.use( express.json() )


// RUTAS
app.use('/api/auth', require('./routes/auth'))


app.use('/api/events', require('./routes/events'))















// ESCUCHAR PETICIONES

app.listen(process.env.PORT,
     console.log(`Servidor corriendo en puerto ${ process.env.PORT }`)






















