const cassandra = require('cassandra-driver');
const util = require('util')
const AddressTranslator = require('cassandra-driver').policies.addressResolution.AddressTranslator;

class MyAddressTranslator extends AddressTranslator {
    translate(address, port, callback) {
      callback(null, process.env.DSE_NODES, port)
    }
  }

const client = new cassandra.Client({
    contactPoints: [process.env.DSE_NODES],
    localDataCenter: process.env.DSE_DC,
    keyspace: process.env.DSE_KEYSPACE,
    authProvider: new cassandra.auth.PlainTextAuthProvider(process.env.DSE_USER, process.env.DSE_PASS),
    socketOptions: {
        connectTimeout : 10000
    }, 
    policies: { 
        addressResolution: new MyAddressTranslator() 
      }
});

client.connect()
    .then(() => console.log('Connected to DSE'))
    .catch(err => console.error('Failed to connect to DSE', err));

module.exports = client;
