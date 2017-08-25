'use strict';

//var flash = require('connect-flash');

module.exports = function(app){
	var HomeController ={
		index: function(req,res){
			var mensagens = req.flash('info');
		    res.render('login',
		    {
		        messages:mensagens,
		        isMessages: mensagens.length>0
		    });			
		}
	}
	return HomeController;
}