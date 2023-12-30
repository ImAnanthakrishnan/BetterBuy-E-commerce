const User = require('../model/userModel');

const loadUser = async(req,res)=>{
    try{

        var search = '';
        if(req.query.search){
            search = req.query.search
        }

        var page = 1;
        if(req.query.page){
            page=req.query.page;
        }

        const limit = 10;

    
        const userData = await User.find({
            is_admin:0,
            $or:[
                {fname:{$regex:'.*'+search+'.*',$options:'i'}},
                {lname:{$regex:'.*'+search+'.*',$options:'i'}},
                {email:{$regex:'.*'+search+'.*',$options:'i'}},
                {phone:{$regex:'.*'+search+'.*',$options:'i'}}
            ]
    }).limit(limit * 1)
    .skip((page - 1) * limit)
    .lean().exec();


    const count = await User.find({
        is_admin:0,
        $or:[
            {fname:{$regex:'.*'+search+'.*',$options:'i'}},
            {lname:{$regex:'.*'+search+'.*',$options:'i'}},
            {email:{$regex:'.*'+search+'.*',$options:'i'}},
            {phone:{$regex:'.*'+search+'.*',$options:'i'}}
        ]
}).countDocuments()
;
const totalPages = Math.ceil(count/limit);
const pages = [];
for(let i = 1 ; i <= totalPages ; i++){
    pages.push({
        page:i,
        isCurrentPage:i===page,
    });
}
console.log(count)

        res.render('admin/user',{title:'user_details',userData,admin:true,style:'admin.css',message:req.flash('message'),totalPages , currentPage:page, pages });
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