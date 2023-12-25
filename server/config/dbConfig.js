const mongoose = require('mongoose');

//console.log(process.env.MONGO_URL);

mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });

const connection = mongoose.connection;

connection.on('connected', () => {
    console.log('Mongodb connection Successful!');
})

connection.on('error', () => {
    console.log('Mongodb connection Failed!');
})

module.exports = connection;