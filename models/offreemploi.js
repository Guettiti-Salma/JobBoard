const mongoose = require('mongoose');

var offreemploiScema = new mongoose.Schema({

jobtitle: {type : String},
category: {type : String},
education: {type : String},
time: {type : String},
jobdescription: {type : String},
experience: {type : String},
date: {type : Date},
companyname: {type : String},
website: {type : String},
email: {type : String},
location: {type : String},
imageName : {type : String},
});


mongoose.model('Offreemploi',offreemploiScema);