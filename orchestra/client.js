const Client = require("node-rest-client").Client;
let client = null;

/** Konfiguracia */
const configuration = {
  host: process.env.ORCHESTRA_HOST,
  port: process.env.ORCHESTRA_PORT,
  protocol: process.env.ORCHESTRA_PROTOCOL,
  serviceGroupCreationTimeout: 60000,
};



const getOrchestraClient = () => {
  if (client !== null) return client;

  /** REST Client */
  const options_auth = {
    user: process.env.ORCHESTRA_USER,
    password: process.env.ORCHESTRA_PASSWORD,
  };

  client = new Client(options_auth);

  return client;
}
module.exports = {
  configuration,
  getOrchestraClient
}