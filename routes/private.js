var express = require('express');
var router = express.Router();


router.get('/profile',function(req,res,next){
    res.render('profile',{user:req.user});
});

router.get('/config',function(req,res,next){
    res.send('configuration man');
});

router.get('/private',function(req,res,next){
    res.render('private');
});

module.exports = router;