const Banner = require('../model/bannerModel')
const bannerLoad = async(req,res)=>{
    try{
const banner = await Banner.find().lean();
res.render('admin/banner',{title:'Banner',style:'admin.css',admin:true,banner})
      
    }
    catch(err){
        console.log(err.message);
    }
}

const addBannerLoad = async(req,res)=>{
    try{
    res.render('admin/add-banner',{title:'Banner',style:'admin.css',admin:true,message:req.flash('message')});
    }
    catch(err){
        console.log(err.message);
    }
}

const addBanner = async(req,res)=>{
    try{

     /*   const images = req.files.map(file => file.filename);
    console.log(images);*/
        // Check if a banner already exists
        console.log(req.body.image)
        const existingBanner = await Banner.findOne({postion:req.body.position});
    
        if (existingBanner) {
  
            req.flash('message','Banner already exist');
            res.redirect('/admin/add-banner');

        } else {
          // If no banner exists, create a new one
          const newBanner = new Banner({ 
            image: req.body.image,
            position: req.body.position.toLowerCase()
        });
         const banner = await newBanner.save();
         if(banner){
            req.flash('message','Banner is added');
            res.redirect('/admin/add-banner');
           }
        }
      

    }
    catch(err){
        console.log(err.message);
    }
}

const deleteBanner = async(req,res)=>{
    try{
   const id = req.query.id;
   const banner = await Banner.deleteOne({_id:id});
   res.redirect('/admin/banner');
    }
    catch(err){
        console.log(err.message);
    }
}

module.exports = {bannerLoad,addBannerLoad,addBanner,deleteBanner};