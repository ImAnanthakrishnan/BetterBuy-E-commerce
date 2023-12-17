const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer();
const auth = require('../middleware/userauth');
const blocked = require('../middleware/block_unblock');
const{check,validationResult} = require('express-validator');
const userController = require('../controller/userController');
const homeController = require('../controller/homeController');
const groceryController = require('../controller/groceryController');
const productsController = require('../controller/productsController');
const accountsController = require('../controller/accounts_controller');
const cartController = require('../controller/cartController');
const checkoutController = require('../controller/checkoutController');
const couponController = require('../controller/couponController');
const walletcontroller = require('../controller/walletController');


router.get('/',auth.isLogout,userController.loadLogin);
router.post('/',userController.verifyLogin,blocked.checkBlocked)
router.get('/signup',auth.isLogout,userController.loadSignup);

//const urlencoded = express.urlencoded({extended:false});
router.post('/signup',userController.insertUser);/*urlencoded,[
    check('fname','This username must be 3+ character long')
    .exists()
    .isLength({min:3}),
    
    check('email','Email is not valid')
    .isEmail()
    .normalizeEmail()
  ,
  check('phone')
  .isNumeric().withMessage('Phone number must be a number')
  .isLength({ min: 10, max: 15 }).withMessage('Phone number must be between 10 and 15 digits'),
    check('password','Password must be at least 6 character long')
    .isLength({min:6})
    .notEmpty()
    ,
],(req,res,next)=>{
    const errors=validationResult(req)
     
    if(!errors.isEmpty()){
        const alert = errors.array()
        res.render('user/signup',{style:'style.css',user:true,alert})
    }else next()},*/

router.get('/verification',auth.isLogout,userController.loadVerification);
router.post('/verify-otp',auth.isLogout,userController.verifyOtp)
router.post('/resend-otp',auth.isLogout,userController.resendOtp)

router.get('/forgot',auth.isLogout,userController.forgotLoad);
router.post('/forgot',userController.forgotVerify)

router.get('/forgot-password',auth.isLogout,userController.forgotPasswordLoad)
router.post('/forgot-password',userController.resetPassword)



router.get('/home',auth.isLogin,homeController.loadHome)

router.get('/grocery',auth.isLogin,groceryController.loadGrocery)

router.get('/all',auth.isLogin,productsController.loadAllProducts);
router.get('/vegetables',auth.isLogin,productsController.loadVegetables);
router.get('/fruits',auth.isLogin,productsController.loadFruits);
router.get('/single-product',auth.isLogin,productsController.loadSingleProduct);

/*user-profile*/
router.get('/general',auth.isLogin,accountsController.loadGeneral);
router.post('/update-profile',accountsController.updateProfile);
router.get('/password-settings',auth.isLogin,accountsController.loadChangePassword);
router.post('/update-password',accountsController.updatePassword);
router.get('/address',auth.isLogin,accountsController.addressLoad);
router.get('/address-settings',auth.isLogin,accountsController.loadChangeAddress);
router.post('/edit-address',upload.none(),accountsController.editAddress);
router.get('/delete-address',accountsController.deleteAddress);
router.get('/add-address',auth.isLogin,accountsController.loadAddAddress);
router.post('/add-address',accountsController.addAdress);

router.get('/verification1',auth.isLogin,accountsController.loadVerification);
router.post('/verify-otp1',accountsController.verifyOtp)
router.post('/resend-otp1',accountsController.resendOtp)

//cart
router.get('/cart',auth.isLogin,cartController.loadCart);
router.post('/add-cart',auth.isLogin,upload.none(),cartController.add_to_cart);
router.post('/add-cart1',auth.isLogin,upload.none(),cartController.add_to_cart1);
router.post('/update-cart',auth.isLogin,cartController.updateCart);
router.patch('/delete-product',cartController.deleteProduct);

//checkout
router.get('/checkout',auth.isLogin,checkoutController.loadCheckout);
router.post('/place-order',auth.isLogin,upload.none(),checkoutController.placeOrder);
router.get('/order-details',auth.isLogin,checkoutController.orderDetailsLoad)
router.patch('/order-status',auth.isLogin,checkoutController.changeStatus);
router.patch('/order-status1',auth.isLogin,checkoutController.changeStatus1);
router.get('/view-orders',auth.isLogin,checkoutController.viewOrder);
router.get('/order-placed',auth.isLogin,checkoutController.orderPlaceLoad);
router.post('/verifyRazorPay',auth.isLogin,upload.none(),checkoutController.razorpayVerify)

//coupon
router.post('/verifyCoupon',couponController.verifyCoupon);


//wallet
router.get('/wallet',auth.isLogin,walletcontroller.loadWallet);



router.get('/logout',userController.userLogout);
module.exports = router;