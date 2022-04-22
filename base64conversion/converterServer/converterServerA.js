const express = require('express');
const apiRoutes = require('./Routes/ApiRoutes');
const bodyParser = require('body-parser');
const connectDb = require('./DbConnection/connection.js')



const app = express();
const PORT = 4000;


connectDb();

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true }));

app.use('/api', apiRoutes)

app.listen(PORT, () =>{console.log(`Server is running on ${PORT}`)});
