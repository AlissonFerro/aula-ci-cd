const mongoose = require('mongoose');

const User = mongoose.model('User', {
    name: {
        type: String,
        require: true,
        minLength: 3
    },
    lastname: {
        type: String,
        require: true,
        minLength: 3
    },
    salary: {
        type: Number,
        require: true
    }
});

module.exports = User;