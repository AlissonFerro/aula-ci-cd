const mongoose = require('mongoose');
const config = require('config')
 
module.exports = function(){
    const db = config.get('db');
    
    if (process.env.NODE_ENV === 'test') {
        mongoose.connection.close(function () {
          console.log('Mongoose connection disconnected');
        });
      }
    mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => console.log(`connected to ${db}`));
}