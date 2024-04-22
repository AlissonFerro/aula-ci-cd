const express = require('express');
const user = require('../routes/user');

module.exports = (app) => {
    app
        .use(express.json())
        .use('/api/user', user)
}