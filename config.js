var express = require('express');
var passport = require('passport');

var Strategy = require('passport-local').Strategy;
var user = require('./models/user');

// Configure the local strategy for use by Passport.
// The local strategy require a `verify` function which receives the credentials
// (`username` and `password`) submitted by the user.  The function must verify
// that the password is correct and then invoke `cb` with a user object, which
// will be set at `req.user` in route handlers after authentication.
passport.use('local.login', new Strategy({    
    passReqToCallback:true
},function(req,username, password, cb) {  
    user.findOne({'email':username},function(err,user){
        if(err) return cb(err);
        if(!user) return cb(null,false);
        if(!user.validPassword(password)){
            //req.flash('info','Login ou senha inválidos');
            return cb(null,false,req.flash('info','Login ou senha inválidos, tente novamente'));
        }
        req.flash('info','Bem vindo: ' + username);
        var roles = ['admin','user'];
        user.roles = roles;
        cb(null, user);
    });
}));


// Configure Passport authenticated session persistence.
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  The
// typical implementation of this is as simple as supplying the user ID when
// serializing, and querying the user record by ID from the database when
// deserializing.
passport.serializeUser(function(user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
    user.findById(id, function (err, user) {
    if (err) { return cb(err); }
    cb(null, user);
  });
});