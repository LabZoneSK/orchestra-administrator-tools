const client = require('./client');
const clientWithAuth = client.getOrchestraClient();
const curl = new(require('curl-request'))();

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

const publishBranch = (branchId, delay = 0) => {
  return new Promise((resolve, reject) => {
    if (!Number.isInteger(parseInt(branchId))) {
      console.log(`Branch ID has not been specified.`)
      resolve(false);
    }

    //TODO: Interval by sa mal niekde ulozit pre pripad, ze ho chcem zrusit
    console.log(`Publish branch ID ${branchId} has been set with delay ${delay/1000} seconds.`)
    const intervalID = setTimeout(() => {
      console.log(`Publish branch ID ${branchId} has been set with delay ${delay/1000} seconds.`)

      clientWithAuth.post(
        `${client.configuration.protocol}://${client.configuration.host}:${
          client.configuration.port
        }/qsystem/rest/config/branches/${branchId}/publish/`,
        (data, response) => {
          console.log(response.statusCode)
          return
        })
    }, delay);

    resolve(intervalID)
  });
}

module.exports = {
  getBranchInfo,
  publishBranch
}