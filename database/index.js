const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/db_jogos', {
    useNewUrlParser: true,
    useUnifiedTopology: true

});

module.exports = mongoose;