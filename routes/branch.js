const express = require('express');
const router = express.Router();

const utils = require('../helpers/utils')
const branchAPI = require('../orchestra/branchAPI');

router.get('/', (req, res) => {
  res.send('Please, specify what branch :-)');
});

router.get('/:id', (req, res) => {
  branchAPI.getBranchInfo(req.params.id)
    .then(data => res.send(data))
    .catch(err => console.log('Not able to fetch data from Orchestra. ', err));
});

/** Publish branch immediately */
router.get('/:id/publish', (req, res) => {
  branchAPI.publishBranch(req.params.id, 0)
    .then(timerID => res.send(timerID))
    .catch(err => console.log('Not able to fetch data from Orchestra. ', err));
});

/** Publish branch with specified delay */
router.get('/:id/publish/:delay', (req, res) => {

  //TODO: Validate input!
  const delay = utils.getDateDifference(decodeURIComponent(req.params.delay));
  console.log(delay)

  branchAPI.publishBranch(req.params.id, delay)
    .then((timerID) => {
      console.log(timerID)
      res.send(JSON.stringify({
        result: `Publikovanie nastavení je nastavené.`
      }))
    })
    .catch(err => console.log('Not able to fetch data from Orchestra. ', err));
});

module.exports = router;