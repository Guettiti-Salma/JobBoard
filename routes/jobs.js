const router = require('express').Router()
// Models
const mongoose = require('mongoose')
const User = require('../models/user')
const Offreemploi = require('../models/offreemploi')
const Offreemplois = mongoose.model('Offreemploi')



const multer = require("multer");


var Storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, "./public/images");
    },
    filename: function (req, file, callback) {
        callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
    },
});



var upload = multer({
    storage: Storage,
}).single("img"); //Field name and max count



router.get('/list',function(req, res, next) {
    if (req.isAuthenticated() && (req.user.isAdmin() )) {
        Offreemplois.find((err, docs) => {
            if (!err) {
                res.render("listJobs", {
                    list: docs
                });
            }
            else {console.log('Error in retrieving offreemplo list :' + err);
            }
        });


    }
    else if (req.isAuthenticated() && ( req.user.isCompany())) {
        Offreemplois.find({companyname:req.user.name},(err, docs) => {
            if (!err) {
                res.render("listJobs", {
                    list: docs
                });
            }
            else {console.log('Error in retrieving offreemplo list :' + err);
            }
        });
    }
    else {
        res.sendStatus(403) // Forbidden
    }
});

router.get('/addJob',function(req, res, next) {
    if (req.isAuthenticated()) {

        if (req.user.isAdmin() || req.user.isCompany())
        {
            res.render('addJob')
        }
        else
        {
            log.console('erreur');
        }

    } else {

        res.sendStatus(403) // Forbidden
    }
});

router.post('/addjob',(req,res)=>{ upload(req, res, function (err) {
        if (err) {
            console.log(err);
            return res.end("Something went wrong");
        } else {
            insertRecord(req, res)
        }
    });
    }

);



function insertRecord(req, res) {
    var offreemploi = new Offreemplois();
    offreemploi.jobtitle =req.body.jobtitle;
    offreemploi.category = req.body.category;
    offreemploi.jobdescription = req.body.jobdescription;
    offreemploi.experience = req.body.experience;
    offreemploi.gender = req.body.gender;
    offreemploi.date = req.body.date;
    offreemploi.companyname = req.body.companyname;
    offreemploi.website = req.body.website;
    offreemploi.email = req.body.email;
    offreemploi.location = req.body.location;
    offreemploi.time = req.body.time;
    offreemploi.education = req.body.education;

    console.log(req.file.path);
    var imageName = req.file.filename;
    offreemploi.imageName = imageName;

    offreemploi.save((err, doc) => {
            if (!err)
                res.redirect('/jobs/list')
            else {
                console.log('Error during record insertion : ' + err)
            }
        }
    );
};

router.get('/delete/:id',(req, res)=>{
    Offreemplois.findByIdAndRemove({_id:req.params.id}, err=>{
        if(err){
            console.log(err);
        }else{
            res.redirect('/jobs/list');
        }
    });
})

// ROUTE TO SHOW UPDATE ELEMENT
router.get('/edit/:id', (req, res, next) => {
    console.log(req.params.id);
    // res.send(req.params.id);
    Offreemplois.findOneAndUpdate({_id: req.params.id},req.body, { new: true }, (err, docs)=>{
        console.log(docs);

        res.render('editJob', {job:docs});
    })
});

// ROUTE TO UPDATE ELEMENT
router.post('/edit/:id', (req, res, next) => {

    Offreemplois.findByIdAndUpdate({_id: req.params.id},req.body, (err)=>{
        if (err) {
            console.log(err);
            next(err);
        } else {
            res.redirect('/jobs/list');
        }
    })
    // next();
});

module.exports = router;