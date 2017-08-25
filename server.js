'use strict';
var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');
var body = require('body-parser');
var session = require('express-session');
var checkRoles = require('./express-check-roles');
var app = express();
var router = express.Router();
var load = require('express-load');


mongoose.connect('mongodb://127.0.0.1:27017/shoppingcart');


require('./config'); //esquema de validação de usuario e outras configuraçoes do passport


app.set('view engine','ejs');
app.use(body.urlencoded({ extended: true }));
app.use(body.json());
app.use(flash());
app.use(session({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/profile',
    checkRoles.isLoggedIn(
    {
        messages:'Acesso nao',
        useErr: 'Acesso negado em config'
    })
);

app.use('/private',[checkRoles.isLoggedIn(
    {
        useErr: 'Login ou senha inválidos'
    }),
    checkRoles.checkRoles(
    {
        roles:['admin','user'],
        redirectTo:'/some',
        useErr: 'Acesso negado'
    }
    )]
);

app.use('/config',[checkRoles.checkRoles(
    {
        roles:['config'],
        redirectTo:'/some',
        useErr: 'Acesso negado em config'
})]);



app.use('/interno',require('./routes/internal'));
app.use('/',require('./routes/private'));

app.get('/',function(req,res,next){   
    var mensagens = req.flash('info');
    res.render('login',
    {
        messages:mensagens,
        isMessages: mensagens.length>0
    });
});


app.post('/', passport.authenticate('local.login', 
{
     failureRedirect: '/' ,     
     failureFlash:true,
     passReqToCallback:true 
}),
  function(req, res) {      
    res.redirect('/profile');
});

app.listen(8080,function(){
    console.log('funfando em: '+ this.address().port);
});