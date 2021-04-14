const router = require('express').Router()
// Models
const mongoose = require('mongoose')
const User = require('../models/user')

const Companies = mongoose.model('User')

router.get('/list',function(req, res, next) {
    if (req.isAuthenticated() && req.user.isAdmin()) {
        Companies.find({role : 'Company'} , (err, docs) => {
            if (!err) {
                res.render("listCompanies", {
                    list: docs
                });
            }
            else {console.log('Error in retrieving companies list :' + err);
            }
        });
    }
    else {
        res.sendStatus(403) // Forbidden
    }
});




router.get('/addCompany',function(req, res, next) {
    if (req.isAuthenticated() && req.user.isAdmin()) {
        res.render('addCompany')
    } else {
        res.sendStatus(403) // Forbidden
    }
});


router.post('/addCompany',(req,res)=>{
        var comp = new Companies();
        comp.name = req.body.name;
        comp.webSite = req.body.webSite
        comp.location = req.body.location
        comp.email = req.body.email
        comp.password = User.generateHash('company')
        comp.role = 'Company'



        comp.save((err, doc) => {
                if (!err)
                    res.redirect('/companies/list')
                else {
                    console.log('Error during record insertion : ' + err)
                }
            }
        );

    }

);



router.get('/deleteCompany/:id',(req, res)=>{
    Companies.findByIdAndRemove({_id:req.params.id}, err=>{
        if(err){
            console.log(err);
        }else{
            res.redirect('/companies/list');
        }
    });
})





// ROUTE TO SHOW UPDATE ELEMENT
router.get('/editCompany/:id', (req, res, next) => {
    console.log(req.params.id);
    // res.send(req.params.id);
    Companies.findOneAndUpdate({_id: req.params.id},req.body, { new: true }, (err, docs)=>{
        console.log(docs);

        res.render('editCompany', {company:docs});
    })
});



// ROUTE TO UPDATE ELEMENT
router.post('/editCompany/:id', (req, res, next) => {

    Companies.findByIdAndUpdate({_id: req.params.id},req.body, (err)=>{
        if (err) {
            console.log(err);
            next(err);
        } else {
            res.redirect('/companies/list');
        }
    })
    // next();
});

module.exports = router;