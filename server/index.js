const express = require('express');
const path = require('path');
const router = require('./routes');
require('dotenv').config({ path: path.resolve(__dirname, './../example.env') });

const app = express();
app.use(express.json());

app.use('/reviews', router);

app.get(`/${process.env.LOADER}`, (req, res) => {
  res.send(`${process.env.LOADER}`);
});

const port = process.env.PORT;

app.listen(port, () => { console.log(`listening on ${port}`); });
