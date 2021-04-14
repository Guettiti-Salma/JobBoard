const router = require('express').Router()
// Models
const mongoose = require('mongoose')
const User = require('../models/user')
const Offreemploi = require('../models/offreemploi')
const Offreemplois = mongoose.model('Offreemploi')

const apply = require('../models/apply')
const apply1 = mongoose.model('apply')
const Companies = mongoose.model('User')

const multer = require("multer");




var Storage1 = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, "./public/cv");
    },
    filename: function (req, file, callback) {
        callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
    },
});



var upload1 = multer({
    storage: Storage1,
}).single("cv"); //Field name and max count


router.get('/', function(req, res, next) {
                Offreemplois.find((err, docs) => {
                        if (!err) {
                                res.render("home", {
                                        list: docs
                                });
                        }
                        else {console.log('Error in retrieving offreemplo list :' + err);
                        }
                });

});







router.get('/details/:id',function(req, res, next) {
    const id = req.params.id;
        Offreemplois.findOneAndUpdate({_id: req.params.id},req.body, { new: true }, (err, docs)=>{
                //console.log(docs);

                apply1.find({},(err,docs1)=>{
                    if (!err) {
                        var result = true;
                        for(var i=0;i<docs1.length;i++)
                        {
                            //console.log(id);

                            if(docs1[i].idJob === id)
                            {
                                if(docs1[i].idUser == req.user._id)
                                { result=false;}

                            }
                        }
                        console.log(result);
                        res.render('detailsJob', {job: docs, result: result});
                    }
                })

        })
});

router.post('/',function(req, res, next) {
        const job = req.body.search1
        Offreemplois.find({jobtitle : job} , (err, docs) => {
                if (!err) {
                        res.render("home", {
                                list: docs
                        });
                }
                else {console.log('Error in retrieving companies list :' + err);
                }
        });
});

router.get('/profile',function(req, res, next) {
        if (req.isAuthenticated()) {
              res.render("profile")
        }
        else {
                res.sendStatus(403) // Forbidden
        }
});

router.get('/changePassword',function(req, res, next) {
    if (req.isAuthenticated()) {
        res.render("changePassword", {
            error: '',
        });
    }
    else {
        res.sendStatus(403) // Forbidden
    }
});

router.post('/changePassword',function(req, res, next) {
    // check password validity
    if (!req.user.validPassword(req.body.oldpassword)) {
        res.render("changePassword", {
            error: 'Invalid Password',
        });
    }
    else {
        const password = User.generateHash(req.body.newpassword)
        Companies.findByIdAndUpdate({_id: req.user._id}, {password: password}, (err) => {
            if (err) {
                console.log(err);
                next(err);
            } else {
                res.redirect('/');
            }
        })
    }

});

router.post('/apply',(req,res)=>{ upload1(req, res, function (err) {
        if (err) {
            console.log(err);
            return res.end("Something went wrong");
        } else {
            var apply = new apply1();
            var fileName = req.file.filename;
            apply.file = fileName;
            apply.idJob = req.body.idJob;
            apply.idUser = req.user._id;


            apply.save((err, doc) => {
                    if (!err)
                        res.redirect('/')
                    else {
                        console.log('Error during record insertion : ' + err)
                    }
                }
            );
        }
    });
    }

);


module.exports = router;