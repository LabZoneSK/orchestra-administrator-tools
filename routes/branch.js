const express = require('express');
const router = express.Router();

const store = require('../helpers/storage').getStore();
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

/** Cancel publish branch schedule */
router.get('/:id/cancel-publish', (req, res) => {
  branchAPI.cancelBranchPublish(req.params.id, 0)
    .then(() => res.send({result: 'Publikovanie zastavene.'}))
    .catch(err => console.log('Not able to fetch data from Orchestra. ', err));
});

/** Publish branch with specified delay */
router.get('/:id/publish/:delay', (req, res) => {

  const {
    id,
    delay
  } = req.params;

  //TODO: Validate input!
  const delayAsDate = utils.getDateDifference(decodeURIComponent(delay));

  branchAPI.publishBranch(id, delay)
    .then((timerID) => {
      store.union('schedules', {
        branchId: id,
        date: decodeURIComponent(delay)
      });

      res.send(JSON.stringify({
        result: `Publikovanie nastavení je nastavené.`
      }))
    })
    .catch(err => console.log('Not able to fetch data from Orchestra. ', err));
});

module.exports = router;