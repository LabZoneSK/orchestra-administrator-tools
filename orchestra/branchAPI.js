const client = require('./client');
const clientWithAuth = client.getOrchestraClient();
const curl = new(require('curl-request'))();

const store = require('../helpers/storage').getStore();
const utils = require('../helpers/utils');

let scheduleTimers = [];

const getBranchInfo = (branchId) => {
  return new Promise((resolve, reject) => {
    if (!Number.isInteger(parseInt(branchId))) {
      console.log(`Branch ID has not been specified.`)
      resolve(false);
    }

    clientWithAuth.get(
      `${client.configuration.protocol}://${client.configuration.host}:${
        client.configuration.port
      }/qsystem/rest/servicepoint/branches/${branchId}/`,
      (data, response) => {
        console.log(data)
        resolve(data);
      }
    );
  });
}

const publishBranch = (branchId, delay) => {
  return new Promise((resolve, reject) => {
    if (!Number.isInteger(parseInt(branchId))) {
      console.log(`Branch ID has not been specified.`)
      resolve(false);
    }

    const publishDelayInMiliseconds = utils.getDateDifference(delay)

    //TODO: Interval by sa mal niekde ulozit pre pripad, ze ho chcem zrusit
    console.log(`Publish branch ID ${branchId} has been set with delay ${publishDelayInMiliseconds/1000} seconds.`)
    const timeoutObj = setTimeout(() => {
      
      const schedules = store.get('schedules')
      const newSchedule = schedules.filter((schedule) => {
        return schedule.branchId !== branchId;
      })
      store.set('schedules', newSchedule)
      
      clientWithAuth.post(
        `${client.configuration.protocol}://${client.configuration.host}:${
          client.configuration.port
        }/qsystem/rest/config/branches/${branchId}/publish/`,
        (data, response) => {
          if(response.statusCode === 200) {
            console.log(`Publish branch ID ${branchId} has been set with delay ${publishDelayInMiliseconds/1000} seconds.`)
          } else {
            console.log(`ERROR: Publish branch ID ${branchId} has not been set. Response code: ${response.statusCode}.`)
          }
          return
        })
    }, publishDelayInMiliseconds);

    scheduleTimers[branchId] = timeoutObj;

    resolve()
  });
}

const cancelBranchPublish = (branchId) => {
  return new Promise((resolve, reject) => {
    if (!Number.isInteger(parseInt(branchId))) {
      console.log(`Branch ID has not been specified.`)
      resolve(false);
    }

    const timeoutObj = scheduleTimers[branchId];
    console.log('clearing timeout', timeoutObj)
    clearTimeout(timeoutObj);

    resolve();
  });
}

module.exports = {
  getBranchInfo,
  cancelBranchPublish,
  publishBranch
}