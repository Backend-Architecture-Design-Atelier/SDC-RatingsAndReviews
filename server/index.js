const express = require('express');
const path = require('path');
const router = require('./routes.js');
require('dotenv').config();

const app = express();
app.use(express.json());

app.use('/reviews', router);

const port = process.env.PORT;

app.listen(port, () => {console.log(`listening on ${port}`)});