require("dotenv").config();

const express = require('express');
const cors = require('cors');
const app = express();

/** Routes */
const configuration = require('./routes/configuration');
const branch = require('./routes/branch');

//app.use(cors);

// Add headers
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);

  next();
});

app.use('/', express.static('./client/build'))
app.use('/api/configuration/', configuration);
app.use('/api/branch/', branch);

/** Server REST API 
app.get('/', (req, res) => {
  res.send('Express has started.');
});
*/

app.listen(process.env.EXPRESS_PORT, () => console.log(`Application is listening on port ${process.env.EXPRESS_PORT}`));

