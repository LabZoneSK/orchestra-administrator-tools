const client = require('./client');
const clientWithAuth = client.getOrchestraClient();

const getBranches = () => {
  console.log(client.configuration);
  
  return new Promise((resolve, reject) => {
    clientWithAuth.get(
      `${client.configuration.protocol}://${client.configuration.host}:${
        client.configuration.port
      }/qsystem/rest/config/branches/`,
      (data, response) => {
        resolve(data);
      }
    );
  });
}

module.exports = {
  getBranches
}