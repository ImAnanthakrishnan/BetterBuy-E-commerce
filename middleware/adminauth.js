const isLogin = async(req,res,next)=>{
    try{
        if(req.session.admin_id){
        return next()
          }
          else{
             return res.redirect('/admin');
          }
        
    }
    catch(err){
        console.log(err.message);
        
    }
}


const isLogout = async(req,res,next)=>{
    try{
        if(req.session.admin_id){
           return res.redirect('/admin/home');
        }
           
        next();
      
    }
    catch(err){
        console.log(err.message);
        
    }
}
module.exports={
    isLogin,isLogout
}