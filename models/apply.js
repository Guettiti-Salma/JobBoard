const mongoose = require('mongoose');

var applySchema = new mongoose.Schema({

    idJob: {type : String},
    idUser: {type : String},
    file: {type : String},
});


mongoose.model('apply',applySchema);