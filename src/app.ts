const bodyParser = require('body-parser');
const morgan = require('morgan');
const apiRouter = require('./api/index');
const express = require('express');
const app = express();

let PORT = process.env.PORT || 8080;

//middlewares
app.use(morgan('dev'));
app.use(bodyParser.json());

//routes
app.use('/', apiRouter);

app.listen(PORT, () => {
  console.log('Running on ' + PORT);
});
