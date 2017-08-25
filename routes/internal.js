var express = require('express');
var router = express.Router();
var checkRoles = require('../express-check-roles');

router.use('/interno',checkRoles.checkRoles({roles:['admin'],message:'Acesso apenas para usuarios logados'}));

router.get('/interno',function(req,res,next){
    res.render('internal/internal');
});

router.get('/config',function(req,res,next){
    res.send('configuration man');
});

router.get('/private',function(req,res,next){
    res.render('private');
});

module.exports = router;