const User = require('../model/userModel');

const checkBlocked = async(req,res,next)=>{
try{
    const blockedUser = await User.find({is_blocked:true});
    const blocked = blockedUser.map(user=>user._id.toString());
    const userId = req.session?req.session.user_id:null;
  
    if(blocked.includes(String(userId))){
        //req.flash('blockmsg','Access denied.Blocked user');
       // req.session.destroy();
        res.render('user/login',{title:'login',style:'style.css' , user:true,block:'Access denied.Blocked user'})
      //return res.redirect('/')
    }else{
         res.redirect('/home');
        next()
    }
   
}
catch(err){


    console.log(err.message);
}
    
}
module.exports = {checkBlocked};