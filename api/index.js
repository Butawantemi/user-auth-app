const express = require('express')
const bodyParser = require('body-parser');
const sequelize = require('./Config/dbConnect');
require('dotenv').config()

const app = express()

//Middleware
app.use(bodyParser.json());

const port = process.env.PORT || 4000;


app.get('/', (req, res) => {
    res.send('Hello World');
})

sequelize.sync().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}).catch(err => console.log(err));

module.exports = app;