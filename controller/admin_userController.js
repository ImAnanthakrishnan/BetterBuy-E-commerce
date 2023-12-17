const User = require('../model/userModel');

const loadUser = async(req,res)=>{
    try{

        var search = '';
        if(req.query.search){
            search = req.query.search
        }

        const userData = await User.find({
            is_admin:0,
            $or:[
                {fname:{$regex:'.*'+search+'.*',$options:'i'}},
                {lname:{$regex:'.*'+search+'.*',$options:'i'}},
                {email:{$regex:'.*'+search+'.*',$options:'i'}},
                {phone:{$regex:'.*'+search+'.*',$options:'i'}}
            ]
    }).lean()
        res.render('admin/user',{title:'user_details',userData,admin:true,style:'admin.css',message:req.flash('message')});
    }
    catch(err){
        console.log(err.message)
    }
}

const blockUser = async(req,res)=>{

    try{
       
        const id = req.query.id;
        const user = await User.findByIdAndUpdate({_id:id},{$set:{is_blocked:true}})
      
        if(user){
            const userData = await User.find({is_admin:0}).lean();
            if(req.session && req.session.user_id === id){
                req.session.user_id = null;
            }
          req.flash('message','User blocked');
          res.redirect('/admin/user');
       
        }
       
    }
    catch(err){
        console.log(err.message)
    }
}

const unblockUser = async(req,res)=>{
    try{
        
        const id = req.query.id;
        const user = await User.findByIdAndUpdate({_id:id},{$set:{is_blocked:false}})
        if(user){
            const userData = await User.find({is_admin:0}).lean()
            req.flash('message','User unblocked');
            res.redirect('/admin/user')
       
        }
    }
    catch(err){
        console.log(err.message)
    }
}

module.exports={loadUser,blockUser,unblockUser}