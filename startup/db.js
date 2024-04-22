const mongoose = require('mongoose');
const config = require('config');

module.exports = function() {
    const db = config.get('db');

    if (process.env.NODE_ENV !== 'test') {
        mongoose.connect(db)
            .then(() => console.log(`connected to ${db}`))
            .catch(err => console.error('Error connecting to MongoDB:', err));
    }
};