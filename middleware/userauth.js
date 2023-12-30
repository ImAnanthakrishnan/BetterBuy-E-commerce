const isLogin = async(req,res,next)=>{
    try{
        if(req.session.user_id){
            next()
          }
          else{
        
            return res.redirect('/');
        
          }

    }
    catch(err){
        console.log(err.message);
        
    }
}


const isLogout = async(req,res,next)=>{
    try{
        if(req.session.user_id){
           return res.redirect('/home');
        }else{
            //console.log('hey')
            next()
        }
        
    }
    catch(err){
        console.log(err.message);
        
    }
}

/*const redirectHome = async(req,res)=>{
    try{
      if(req.session && req.session.user_id){
        next();
      }else{
        res.redirect('/home');
      }
    }
    catch(err){
        console.log(err.message);
    }
}*/

module.exports={
    isLogin,isLogout,
}