const cassandra = require('cassandra-driver');
const util = require('util')

// function StaticAddressTranslator() {
// }

// util.inherits(StaticAddressTranslator, cassandra.AddressTranslator);

// StaticAddressTranslator.prototype.translate = function (address, port, callback) {
//     callback(null, "127.0.0.1","9042") 
// };

const client = new cassandra.Client({
    contactPoints: [process.env.DSE_NODES],
    localDataCenter: process.env.DSE_DC,
    keyspace: process.env.DSE_KEYSPACE,
    authProvider: new cassandra.auth.PlainTextAuthProvider(process.env.DSE_USER, process.env.DSE_PASS),
    // policies: {
    //     addressResolution: new StaticAddressTranslator()
    // }

});

client.connect()
    .then(() => console.log('Connected to Cassandra'))
    .catch(err => console.error('Failed to connect to Cassandra', err));

module.exports = client;
