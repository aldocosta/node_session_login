'use strict';
/** 
 * @param {*} options.roles - eg:['admin','user'] 
 * @param {*} options.message  - eg: 'Acess denied to the resource' 
 * @param {*} options.redirectTo - eg: 'errorview'
 * @param {*} options.useErr - eg: 'Custom Error message'
 */
function checkRoles(options){
    return function(req,res,next){
        req.user = req.user || {};
        req.user.roles = req.user.roles || {};
        options.message = options.message || 'Access denied';
        options.redirectTo = options.redirectTo || '/';
        if(req.user.roles){
            if(req.user.roles.length > 0){
                options.roles.map(function(val){                
                    if(req.user.roles.indexOf(val)>-1){
                        return next();                    
                    }
                });          
            }else{
                if(req.flash){
                    req.flash('info',options.message);
                }
                if(!options.useErr){
                    return res.redirect(options.redirectTo);            
                }
                return next(options.useErr);
            }
        }else{
            if(req.flash){
                req.flash('info',options.message);
            }
            if(!options.useErr){
                return res.redirect(options.redirectTo);            
            }
            return next(options.useErr);                  
        }
    }
}


function isLoggedIn(options){
    return function(req,res,next){
        let auth;        
        auth = req.isAuthenticated();
        if(auth){
            return next();        
        }
        if(options.useErr){
            return next(options.useErr);
        }        
            
        res.render(options.redirectTo,{messages:options.messages});
    }    
}

module.exports = {
    checkRoles:checkRoles,
    isLoggedIn:isLoggedIn
};