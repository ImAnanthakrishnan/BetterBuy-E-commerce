const bcrypt = require('bcrypt');
const User  = require('../model/userModel');
const Address = require('../model/addressModel');
const dotenv = require('dotenv');
dotenv.config({path:'./config.env'});
const nodemailer = require('nodemailer');
//const userController = require('../controller/userController');
const userOtpVerification = require('../model/userOtpVerification');
const securePassword = async(password)=>{
    try{
        const passwordHash = await bcrypt.hash(password,10);
        return passwordHash;
    }
    catch(err){
         console.log(err.message)
    }
 }

 let transporter = nodemailer.createTransport({
    service:'gmail',
    auth:{
        user : process.env.AUTH_EMAIL,
        pass : process.env.AUTH_PASS
    }
 });


const loadGeneral = async(req,res)=>{
    try{
        const log = req.session.user_id;
        const id = req.session.user_id;
        const user = await User.findById({_id:id}).lean();
        res.render('user/general',{user:true,style:'style.css',user,message:req.flash('message'),message1:req.flash('message1'),message2:req.flash('message2'),log});
    }
    catch(err){
        console.log(err.message);
    }
}

const updateProfile = async(req,res)=>{
    try{
        const id = req.session.user_id;
        const user = await User.findById({_id:id});
    
        const userCheck = await User.find({_id:{$ne:id}});
      
        const email = userCheck.map(user=>user.email);
        const phone = userCheck.map(user=>user.phone);

        if (email.includes(req.body.email)) {
            req.flash('message1', 'Email already exists');
            res.redirect('/general');
        }else{
            if(user.is_verified === 1 && user.email !== req.body.email){
                const notVerified = await User.updateOne({_id:id},{is_verified:0});
                await sendOtpVerification({_id:id,email:req.body.email},req,res);
            }
        }

        if(phone.includes(req.body.phone)){
            req.flash('message2', 'Phone number already exists');
            res.redirect('/general');
        }
   
       
      
        
        if(user){
            user.fname = req.body.fname || user.fname;
            user.lname = req.body.lname || user.lname;
            user.email = req.body.email || user.email;
            user.phone = req.body.phone || user.phone;
        const updateUser = await user.save();
        if(updateUser){
            req.flash('message','Updated');
            res.redirect('/general');
        }
      }
    }
    catch(err){
        console.log(err.message);
    }
}

const sendOtpVerification = async({_id,email},req,res)=>{
    try{
        const otp = `${Math.floor(1000+Math.random()*9000)}`;

        //mail options
        const mailOptions = {
            from:process.env.AUTH_EMAIL,
            to : email,
            subject:"Verify Your Email",
            html : `<p>Enter ${otp} in the app to verify your email address and complete sign in</p>`
        }

       const newOtpVerification = new userOtpVerification({
           userId: _id,
           otp: otp,
           createdAt: Date.now(),
           expiresAt: Date.now() + 60000
       });
      const otpData = await newOtpVerification.save()
     
   
       const mail = await transporter.sendMail(mailOptions);
       if(mail){    
        const timerExpirationTime = Date.now() + 60000; // 1 minute in milliseconds
        req.session.timerExpirationTime = timerExpirationTime;
       req.flash('smessage','Check mail for otp')
           // Set the timer expiration time in the session
         
       // res.render('user/verification',{otps:otpData.userId,email:email,message: req.flash('message'),style:'style.css',user:true});
       res.redirect(`/verification1?userId=${otpData.userId}&email=${email}&expiresAt=${otpData.expiresAt}`)
       }else{
       // res.render('user/signup',{message:'Registration failed',err:true,user:true});
       }
     
       //res.render('user/signup',{message:'verification otp email sent',data:{userId:_id,email},err:true});
      
    }
    catch(err){
        //throw new Error(err)
        console.log(err.message)
    }
}

const loadVerification = async(req,res)=>{
    try{
        const log = req.session.user_id;
      const userId = req.query.userId;
      const email = req.query.email;
    const expiresAt = req.query.expiresAt
    const timerDuration = Math.floor((req.session.timerExpirationTime - Date.now()) / 1000);
        res.render('user/verification1',{title:'Verification',style:'style.css',user:true,otps:userId,email:email,message:req.flash('message'),smessage:req.flash('smessage'),expiresAt,timerDuration,log});
        
        //res.render('user/verification',{otps:userId,email:email,style:'style.css',user:true});
       
    }
    catch(err){
        console.log(err.message);
    }
}

//otp-verification
const verifyOtp = async(req,res)=>{
    try{
        
        let {userId,otp}=req.body;
       const userD = await User.findOne({_id:userId});
       const email = userD.email;
        console.log('body='+otp)
        if(!userId || !otp){
           // req.flash('message','Empty otp details are not allowed');
           // res.redirect(`/verification?userId=${userId}&email=${email}`);
            throw Error("Empty otp details are not allowed");
        }else{
            const userOtpVerificationRecords  = await userOtpVerification.find({
                userId
            });
            if(userOtpVerificationRecords.length <=0 ){
                req.flash('message',`Account record doesn't exists or has been verified already. Please sign up or login`);
                res.redirect(`/verification1?userId=${userId}&email=${email}`);
                //throw new Error("Account record doesn't exists or has been verified already. Please sign up or login")
            }else{
                const {expiresAt}=userOtpVerificationRecords[0];
                const Otp = userOtpVerificationRecords[0].otp;
              
                if(expiresAt< Date.now()){
                    await userOtpVerification.deleteMany({userId});
                    const timerExpirationTime = Date.now()+1500 // 1 minute in milliseconds
                     req.session.timerExpirationTime = timerExpirationTime;
                    req.flash('message','Otp has expired. Please request again');
                    res.redirect(`/verification1?userId=${userId}&email=${email}`);
                    //throw new Error("Otp has expired. Please request again");
                   // res.render('user/verification',{message:'Otp has expired. Please request again',user:true,err:true,style:'style.css'})
                }else{
                    if(Otp!=otp){
                        const timerExpirationTime = req.session.timerExpirationTime; // 1 minute in milliseconds
                        req.session.timerExpirationTime = timerExpirationTime;
                        req.flash('message','Invalid code passed.Check your Inbox');
                        /*const responseData = {
                            message: 'Wrong OTP',
                            style: '',
                        };
                    
                        res.json(responseData);*/
                        res.redirect(`/verification1?userId=${userId}&email=${email}`);
                        //throw new Error("Inavlid code passed. Check your Inbox.");
                      // res.render('user/verification',{message:'Invalid code passed.Check your Inbox',err:true,user:true,style:'style.css'});
                    }else{
                      const verified = await User.updateOne({_id:userId},{is_verified:1});
                      const delete1 = await userOtpVerification.deleteMany({userId});
                      if(verified){
                       // req.flash('otpmessage','Your account is verified');
                       
                        res.redirect('/general') 
                       //res.render('user/login',{message:'User email verified successfully',err:true,user:true,style:'style.css'});
                      }
                      
                  }
                }
            }
        }
    }
    catch(err){
        //throw new Error(err)
        console.log(err.message)
    }
}

const resendOtp = async(req,res)=>{
    try{
      
        let {userId,email}=req.body;
        console.log(userId,email)
        if(!userId || !email){
            throw Error("Empty user details are not allowed");
        }else{
            await userOtpVerification.deleteMany({userId});

                // Set the timer expiration time in the session
            const timerExpirationTime = Date.now() + 60000; // 1 minute in milliseconds
            req.session.timerExpirationTime = timerExpirationTime;

            sendOtpVerification({_id:userId,email},res);
            req.flash('message','Otp resended. Check your mail');
            res.redirect(`/verification1?userId=${userId}&email=${email}`);
        }
    }
    catch(err){
      //throw new Error(err)
      console.log(err.message)
    }
}


const loadChangePassword = async(req,res)=>{
    try{
        const log = req.session.user_id;
        res.render('user/password-settings',{user:true,style:'style.css',message:req.flash('message'),log});
    }
    catch(err){
        console.log(err.message);
    }
}

const updatePassword = async(req,res)=>{
    try{
        const id = req.session.user_id;
       const userData = await User.findById({_id:id});
        const existingPassword = req.body.password1;

        const newPassword = req.body.password;
        const confirmPassword = req.body.password2;
        
        const passwordMatch = await bcrypt.compare(existingPassword,userData.password);

        if(passwordMatch){
        if(newPassword === confirmPassword){
            const spassword = await securePassword(req.body.password);
            const update = await User.findByIdAndUpdate({_id:id},{password:spassword});
            req.flash('message','Password changed');
            res.redirect('/password-settings');
        }else{
            req.flash('message','Confirm password is wrong');
            res.redirect('/password-settings');
        }
      }else{
        req.flash('message','Password not matched');
        res.redirect('/password-settings');
      }
    }
    catch(err){
        console.log(err.message);
    }
}

const addressLoad = async(req,res)=>{
    try{
        const log = req.session.user_id;
        const id = req.session.user_id;
        const address = await Address.find({user_id:id}).lean();
     res.render('user/address',{title:'Address',user:true,style:'style.css',address,log});
    }
    catch(err){
        console.log(err.messaage);
        res.status(500).json({error:'Internal server error'});
    }
}

const loadChangeAddress = async(req,res)=>{
    try{
        const log = req.session.user_id;
        const id = req.query.id;
        const action = req.query.action;
        //const selectedAddress = req.query.addres;
        const user = await Address.findOne({user_id:log}).lean();
        const address = user.address.find(address=>String(address._id) === id);
   
        if(action === 'addressFetch'){
       const response={
            message:'Address found',
             address
        }

        res.status(200).json(response);
    }else{
        res.render('user/address-settings',{user:true,style:'style.css',address,message:req.flash('message'),log});
    }
       
      
    }
    catch(err){
        console.log(err.message);
    }
}

const editAddress = async(req,res)=>{
    try{
        const {addres,addressId,district,pincode,city,state,country,checkout}=req.body;
        if(checkout === 'address'){
        
            const id = req.session.user_id;
            const address = await Address.findOne({user_id:id});
        
            const updation_address = address.address;
            const specificAddress =  updation_address.find(address=>String(address._id) === String(addressId));
           
            if(specificAddress){
                specificAddress.address = addres || specificAddress.address;
                specificAddress.district = district || specificAddress.district;
                specificAddress.city = city || specificAddress.city;
                specificAddress.pincode = pincode || specificAddress.pincode;
                specificAddress.state = state || specificAddress.state;
                specificAddress.country = country || specificAddress.country;
  
                const updateAddress = await address.save();
               
                if(updateAddress){
                   const response = {
                    message:'Address updated',

                   }
                   res.status(200).json(response);
                }
            
            }


        }else{
            const id = req.session.user_id;
            const address = await Address.findOne({user_id:id});
            //console.log(address)
            const address_id = req.body.address_id;
           const updation_address = address.address;
            //console.log(updation_address);
            const specificAddress =  updation_address.find(address=>String(address._id) === address_id);
            //console.log(specificAddress)
            if(specificAddress){
                specificAddress.address = req.body.address || specificAddress.address;
                specificAddress.district = req.body.district || specificAddress.district;
                specificAddress.city = req.body.city || specificAddress.city;
                specificAddress.pincode = req.body.pincode || specificAddress.pincode;
                specificAddress.state = req.body.state || specificAddress.state;
                specificAddress.country = req.body.country || specificAddress.country;
    
                const updateAddress = await address.save();
                console.log(updateAddress)
                if(updateAddress){
                    req.flash('message','updated');
                    res.redirect(`/address-settings?id=${address_id}`);
                }
            }
        }
      

    }
    catch(err){
        res.status(500).json({error:'Internal server error'})
        console.log(err.message);
    }
}

const deleteAddress = async(req,res)=>{
    try{
        const id = req.session.user_id;
        const addressToDelete = req.query.id;
        const del = await Address.updateOne(
            {user_id:id},
            {$pull:{address:{_id:addressToDelete}}}
        );
        if(del){
            res.redirect('/address');
        }
    }
    catch(err){
        console.log(err.messaage);
    }
}

const loadAddAddress = async(req,res)=>{
    try{
        const log = req.session.user_id;
        const action = req.query.action;
        const id = req.session.user_id;
        const data = await User.findById({_id:id}).lean();
       if(action === 'Add'){
        const response={
            statusText:'Page not found',
        
        }

        res.status(200).json(response);
       }else{
        res.render('user/add-address',{user:true,style:'style.css',data,message:req.flash('message'),log});
       }
       
    }
    catch(err){
        console.log(err.message);
    }
}

const addAdress = async(req,res)=>{
    try{

        const {addres,addressId,district,pincode,city,state,country,checkout}=req.body;
        console.log(addres)
       /* if(!addres.trim() || !addressId.trim() || !district.trim() || !pincode.trim() || !city.trim() || !state.trim() || !country.trim()){
            req.flash('message10','This field is required');
            return res.redirect('/checkout');
        }else{*/
        if(checkout === 'address'){ 
            const data = await Address.findOne({user_id:req.session.user_id});
            if(data){
                const addAdress = [...data.address];
                const addressExists = addAdress.some(addressObj => addressObj.address === addres);
    
                if (addressExists) {
                    req.flash('message','Address already exists');
                    res.redirect('/add-address');
                   
                } else {
                    
                
                addAdress.push({
                    address:addres,
                    district:district,
                    city:city,
                    pincode:pincode,
                    state:state,
                    country:country
                });
            
              const updated = await Address.findOneAndUpdate(
                    {user_id:req.session.user_id},
                    {$set:{address:addAdress}},
                    {new:true}
                    );
                if(updated){
                   const response = {message:'Address added successfully'};
                   res.status(200).json(response);
                }else{
                    const response = {message:'Failed adding address'};
                    res.status(400).json(response);
                }
            }
            }else{
                const address = new Address({
                    user_id:req.session.user_id,
                    address:[{
                        address:addres,
                        district:district,
                        city:city,
                        pincode:pincode,
                        state:state,
                        country:country
                    }]
                });
                const address_data = await address.save();
                if(address_data){
                    const response = {message:'Address added successfully'};
                    res.status(200).json(response);
                }
            }
        }else{
            const data = await Address.findOne({user_id:req.body.user_id});
            if(data){
                const addAdress = [...data.address];
                const addressExists = addAdress.some(addressObj => addressObj.address === req.body.address);
    
                if (addressExists) {
                    req.flash('message','Address already exists');
                    res.redirect('/add-address');
                   
                } else {
                    
                
                addAdress.push({
                    address:req.body.address,
                    district:req.body.district,
                    city:req.body.city,
                    pincode:req.body.pincode,
                    state:req.body.state,
                    country:req.body.country
                });
            
              const updated = await Address.findOneAndUpdate(
                    {user_id:req.body.user_id},
                    {$set:{address:addAdress}},
                    {new:true}
                    );
                if(updated){
                    req.flash('message','Updated');
                    res.redirect('/add-address');
                }else{
                    req.flash('message','Updation failed');
                    res.redirect('/add-address');
                }
            }
            }else{
                const address = new Address({
                    user_id:req.body.user_id,
                    address:[{
                        address:req.body.address,
                        district:req.body.district,
                        city:req.body.city,
                        pincode:req.body.pincode,
                        state:req.body.state,
                        country:req.body.country
                    }]
                });
                const address_data = await address.save();
                if(address_data){
                    req.flash('message','Success');
                    res.redirect('/add-address');
                }
            }
        }
 
    //}
        
    }
    catch(err){
        console.log(err.message)
    }
}

module.exports = {loadGeneral,updateProfile,loadChangePassword,updatePassword,loadChangeAddress,editAddress,deleteAddress,loadAddAddress,addAdress,
addressLoad,loadVerification,verifyOtp,resendOtp};