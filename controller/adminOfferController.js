const Offers = require('../model/categOfferModel');
const Product = require('../model/productModel');
const Category = require('../model/categoryModel');

const offerLoad = async(req,res)=>{
    try{
        const offers = await Offers.find().lean();
        const offer = offers.map(offer=>{
            const expiryDate = new Date(offer.expireAt);
             const formattedExpiry = expiryDate.toLocaleDateString('en-Us',{
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                hour12: true,
                timeZone:'UTC'             
             });
             return {
                ...offer,
                expiry:formattedExpiry/* new Date(coupon.expiry).toLocaleDateString()*/
            };
        })
        res.render('admin/offers',{title:'Offers',admin:true,style:'admin.css',offer});
    }
    catch(err){
        console.log(err.message);
    }
}

const addOffersLoad = async(req,res)=>{
    try{
        res.render('admin/add-offers',{title:'Offers',admin:true,style:'admin.css',message:req.flash('message')});
    }
    catch(err){
        console.log(err.message);
    }
}

const addOffers = async(req,res)=>{
    try{
   const {category,discount,expiry} = req.body;
   
   const expiryWithOffset = expiry + "+00:00";
  // console.log(expiryWithOffset)
   const expiryDate = new Date(expiryWithOffset);
  // console.log(category)
   //console.log(discount)
//console.log(expiry)
//console.log(expiryDate)

//console.log(expiryDate.toISOString())
   const offer = new Offers({
    category:category,
    discount:discount,
    expireAt:expiryDate,
    is_offer:true
   });
   const savedOffers = await offer.save();
   if(savedOffers){
   const products = await Product.find().populate('category_id');
   const offer = await Offers.findOne({is_offer:true});
   const proResult = products.filter(pro=>pro.category_id.category.toLowerCase() === offer.category.toLowerCase())
   console.log(proResult)

const discount = offer.discount; 

const updatedProducts = await Promise.all(
  proResult.map(async (product) => {
    const discountedPrice = product.price * (1 - discount / 100);

    // Update the product with the discounted price
    await Product.findByIdAndUpdate(product._id, { $set: {price : discountedPrice , is_offer : true } });

    return { ...product, discountedPrice };
  })
);

if(updatedProducts){
    await Offers.findOneAndUpdate({is_offer:true},{$set:{is_offer:false}});
}

console.log(`${updatedProducts.length} products updated with individual discounts.`);


      req.flash('message','Offer placed');
      res.redirect('/admin/add-offers');
   }

    }
    catch(err){
        console.log(err.message);
    }
}

module.exports = {offerLoad,addOffersLoad,addOffers};