const express = require('express')
const bodyParser = require('body-parser');
const sequelize = require('./Config/dbConnect');
const authRoutes = require('./Routes/auth.route');
const organisationRoutes = require('./Routes/org.route')
require('dotenv').config()

const app = express()

//Middleware
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT || 4000;

app.use('/', authRoutes);
app.use('/api/organisations', organisationRoutes);

sequelize.sync().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}).catch(err => console.log(err));

module.exports = app;