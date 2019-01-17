const express = require('express');
const router = express.Router();

const configurationAPI = require('../orchestra/configurationAPI');

router.get('/', (req, res) => {
  res.send('Get config');
});

router.get('/branches', (req, res) => {
  configurationAPI.getBranches()
    .then(data => res.send(data))
    .catch(err => console.log('Not able to fetch data from Orchestra. ', err));
});

module.exports = router;