const Store = require('data-store');
const store = new Store({ path: 'app-state.json' });

const getStore = () => {
  return store;
}

module.exports = {
  getStore
}