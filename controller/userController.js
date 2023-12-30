const dotenv = require('dotenv');
dotenv.config({path:'./config.env'});
const nodemailer = require('nodemailer');
const User = require('../model/userModel');
const bcrypt = require('bcrypt')
const userOtpVerification = require('../model/userOtpVerification');
const randomString = require('randomstring')
const asyncHandler = require('express-async-handler');
const { errorMonitor } = require('nodemailer/lib/xoauth2');
const flash = require('connect-flash/lib/flash');


const securePassword = async(password)=>{
    try{
        const passwordHash = await bcrypt.hash(password,10);
        return passwordHash;
    }
    catch(err){
         console.log(err.message)
    }
 }


/*const secureOtp = async(otp)=>{
    try{
        const passwordHash = await bcrypt.hash(otp,10);
        return otpHash;
    }
    catch(err){
         console.log(err.message)
    }
 }*/

 //nodemailer
 let transporter = nodemailer.createTransport({
    service:'gmail',
    auth:{
        user : process.env.AUTH_EMAIL,
        pass : process.env.AUTH_PASS
    }
 });

 //testing
 transporter.verify((error,success)=>{
    if(error){
        console.log(error);
    }else{
        console.log("Ready for verification");
        console.log(success);
    }
 });

 

const loadSignup = async(req,res)=>{
    try{
        res.render('user/signup',{title:'signup' , style:'style.css', user:true,message:req.flash('message'),message1:req.flash('message1'),message2:req.flash('message2'),message3:req.flash('message3')});
    }
    catch(err){
        throw new Error(err);
    }
};

const insertUser = async(req,res)=>{
    try{
        
        const spassword = await securePassword(req.body.password);
        const existEmail = await User.findOne({email:req.body.email});
        const existPhone = await User.findOne({phone:req.body.phone});

        const generateReferalId = () => {
            const timestampPart = Date.now().toString().slice(-8); 
            const randomPart = Math.floor(Math.random() * 100000000).toString().slice(0, 2); 
        
            return timestampPart + randomPart;
        };

        if(existEmail && !existPhone){
         req.flash('message','Email already exists')
            res.redirect('/signup');
            //res.render('user/signup',{message:'Email already exists',style:'style.css',user:true})
        }else
        if(existPhone && !existEmail){
            req.flash('message1','Phone number already exists')
            res.redirect('/signup');
          
        }else if(existPhone && existEmail){
            req.flash('message2','Phone number already exists');
            req.flash('message3','Email already exists');
            res.redirect('/signup');
        }
        const refId = generateReferalId();
        const user = new User({
            fname:req.body.fname,
            lname:req.body.lname,
            email:req.body.email,
            phone:req.body.phone,
            password:spassword,
            is_admin:0,
            referalCode:refId,
            refferedCode:req.body.ref_code
        });
        const userData=await user.save().then((result)=>{
            sendOtpVerification(result,req,res)

           
        })
        
      
    }
    catch(err){
        console.log(err.message)
    }
}

//sendotpverification
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
       res.redirect(`/verification?userId=${otpData.userId}&email=${email}&expiresAt=${otpData.expiresAt}`)
       }else{
        res.render('user/signup',{message:'Registration failed',err:true,user:true});
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
      const userId = req.query.userId;
      const email = req.query.email;
    const expiresAt = req.query.expiresAt
    const timerDuration = Math.floor((req.session.timerExpirationTime - Date.now()) / 1000);
        res.render('user/verification',{title:'Verification',style:'style.css',user:true,otps:userId,email:email,message:req.flash('message'),smessage:req.flash('smessage'),expiresAt,timerDuration});
        
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
                res.redirect(`/verification?userId=${userId}&email=${email}`);
                //throw new Error("Account record doesn't exists or has been verified already. Please sign up or login")
            }else{
                const {expiresAt}=userOtpVerificationRecords[0];
                const Otp = userOtpVerificationRecords[0].otp;
              
                if(expiresAt< Date.now()){
                    await userOtpVerification.deleteMany({userId});
                    const timerExpirationTime = Date.now()+1500 // 1 minute in milliseconds
                     req.session.timerExpirationTime = timerExpirationTime;
                    req.flash('message','Otp has expired. Please request again');
                    res.redirect(`/verification?userId=${userId}&email=${email}`);
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
                        res.redirect(`/verification?userId=${userId}&email=${email}`);
                        //throw new Error("Inavlid code passed. Check your Inbox.");
                      // res.render('user/verification',{message:'Invalid code passed.Check your Inbox',err:true,user:true,style:'style.css'});
                    }else{
                      const verified = await User.updateOne({_id:userId},{is_verified:1});
                      const delete1 = await userOtpVerification.deleteMany({userId});
                      if(verified){
                       // req.flash('otpmessage','Your account is verified');
                      // const userData = await User.findOne({email:email}).lean();
                       req.session.user_id = userD._id;
                        res.redirect('/home'); 
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

//resend otp
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
            res.redirect(`/verification?userId=${userId}&email=${email}`);
        }
    }
    catch(err){
      //throw new Error(err)
      console.log(err.message)
    }
}

//forgot password
const sendResetPassword = async(fname,email,token)=>{
    try{
        const mailOptions = {
            from:process.env.AUTH_EMAIL,
            to : email,
            subject:"For reset Password",
            html : '<p>Hi '+fname+' click here to <a href="http://localhost:5000/forgot-password?token='+token+'"><h3>Reset</h3> </a> your password</p>'
        }

        transporter.sendMail(mailOptions,(error,info)=>{
            if(error){
                console.log(error)
            }else{
                console.log("email has been sent:",info.response);
            }
        })
       /* await transporter.sendMail(mailOptions);
        res.json({
         status:'PENDING',
         message:'verification otp email sent',
         data:{
             userId:_id,
             email
         }
        })*/
    }
    catch(err){
        throw new Error(err);
    }
}

const forgotLoad = async(req,res)=>{
    try{
        res.render('user/forgot',{title:'forgot',style:'style.css',user:true});
    }
    catch(err){
        throw new Error(err);
    }
}

const forgotVerify =async(req,res)=>{
    try{
        const email = req.body.email;
        const userData = await User.findOne({email:email});
        if(userData){
   
            if(userData.is_verified === 0){
                res.render('user/forgot',{message1:'Not a verified email',user:true,err:true})
            }else{
                const randomstring = randomString.generate();
                const updatedDate = await User.updateOne({email:email},{$set:{token:randomstring}})
                sendResetPassword(userData.fname,userData.email,randomstring)
                res.render('user/forgot',{message:"please check your mail to reset password",user:true,err:true})
            }
        }
        else{
            res.render('user/forgot',{message1:'Email is not valid',user:true,err:true})
        }
    }
    catch(err){
        throw new Error(err);
    }
}

const forgotPasswordLoad = async(req,res)=>{
    try{
        const token = req.query.token;
       const tokenData = await User.findOne({token:token})
       if(tokenData){
        res.render('user/forgot-password',{user_id:tokenData._id,user:true,style:'style.css',token});
       }
       else{
       // res.render('404',{message:'Token is invalid'});
       res.status(404).json({message:'token is invalid'});
       }
    }
    catch(err){
        throw new Error(err)
    }
}

const resetPassword= async(req,res)=>{
    try{
        const token = req.body.token;
        console.log(token)
        const password = req.body.password;
        const password1 = req.body.password1
        console.log(password);
        console.log(password1);
        const user_id = req.body.user_id
        if(password !== password1){
            const tokenData = await User.findOne({token:token})
            res.render('user/forgot-password',{user_id:tokenData._id,user:true,style:'style.css',message:'wrong confirmation password'});
        }else{
            const secure_password = await securePassword(password);
        
            const updateData = await User.findByIdAndUpdate({_id:user_id},{$set:{password:secure_password,token:''}})
            req.flash('message1','Password changed')
            res.redirect('/');
        }
       
    }
    catch(err){
        throw new Error(err)
    }
}

const loadLogin = async(req,res)=>{
    try{
      const otpmsg = req.flash('otpmessage')
      //const block = req.flash('blockmsg')
      //console.log(block)
        res.render('user/login',{title:'login',style:'style.css' , user:true,otpmsg,message:req.flash('message'),message1:req.flash('message1')});
    }
    catch(err){
        throw new Error(err);
    }
}

const verifyLogin = async(req,res,next)=>{
    try{
        
        const email = req.body.email;
        const password = req.body.password;
        const userData = await User.findOne({email:email}).lean();
        if(userData){
            const passwordMatch = await bcrypt.compare(password,userData.password);
            if(passwordMatch && userData.is_admin === 0 && userData.is_verified === 1){
             
                req.session.user_id = userData._id;
                    next();
               
                
            }else{
                req.flash('message','Invalid credential');
                res.redirect('/')
            
            }
        }else{
            req.flash('message','Username and password is incorrect');
            res.redirect('/')
          
        }
    }
    catch(err){
        //throw new Error(err);
        console.log(err.message)
    }
}

const userLogout=async(req,res)=>{
    try{
        /*const id = req.query.log;
        console.log(id);
        const store = req.session.store;
        store.destroy(id,(err)=>{
            if(err){
                console.error('Error destroying session:', err);
            }else{
                console.log(`Session with ID ${id} destroyed`);
            }
        })*/
        req.session.user_id=null;
        res.redirect('/');
   
    }
    catch(error){
        console.log(error.message)
    }
}

/*user-profile*/


module.exports = {loadSignup,loadLogin,verifyLogin,
    insertUser,sendOtpVerification,verifyOtp,resendOtp,loadVerification,
forgotLoad,forgotVerify,forgotPasswordLoad,resetPassword,userLogout};