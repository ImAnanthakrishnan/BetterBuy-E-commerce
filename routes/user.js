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
const invoiceController  = require('../controller/invoiceController');

router.get('/',auth.isLogout,userController.loadLogin);

router.post('/',auth.isLogout,userController.verifyLogin,blocked.checkBlocked)
router.get('/signup',auth.isLogout,userController.loadSignup);

//const urlencoded = express.urlencoded({extended:false});
router.post('/signup',auth.isLogout,userController.insertUser);

router.get('/verification',auth.isLogout,userController.loadVerification);
router.post('/verify-otp',auth.isLogout,userController.verifyOtp)
router.post('/resend-otp',auth.isLogout,userController.resendOtp)

router.get('/forgot',auth.isLogout,userController.forgotLoad);
router.post('/forgot',auth.isLogout,userController.forgotVerify)

router.get('/forgot-password',auth.isLogout,userController.forgotPasswordLoad)
router.post('/forgot-password',auth.isLogout,userController.resetPassword)



router.get('/home',homeController.loadHome)

router.get('/about',homeController.aboutLoad);

router.get('/contact',homeController.contactLoad);

router.get('/grocery',groceryController.loadGrocery)

router.get('/all',productsController.loadAllProducts);
router.get('/vegetables',productsController.loadVegetables);
router.get('/fruits',productsController.loadFruits);
router.get('/meat',productsController.loadMeat);
router.get('/breads',productsController.loadBread);
router.get('/product',productsController.loadSingleProduct);

/*user-profile*/
router.get('/general',auth.isLogin,accountsController.loadGeneral);
router.post('/update-profile',auth.isLogin, accountsController.updateProfile);
router.get('/password-settings',auth.isLogin,accountsController.loadChangePassword);
router.post('/update-password',auth.isLogin ,accountsController.updatePassword);
router.get('/address',auth.isLogin,accountsController.addressLoad);
router.get('/address-settings',auth.isLogin,accountsController.loadChangeAddress);
router.post('/edit-address',auth.isLogin,upload.none(),accountsController.editAddress);
router.get('/delete-address',auth.isLogin,accountsController.deleteAddress);
router.get('/add-address',auth.isLogin,accountsController.loadAddAddress);
router.post('/add-address',auth.isLogin,accountsController.addAdress);

router.get('/verification1',auth.isLogin,accountsController.loadVerification);
router.post('/verify-otp1',auth.isLogin,accountsController.verifyOtp)
router.post('/resend-otp1',auth.isLogin,accountsController.resendOtp)

//cart
router.get('/cart',auth.isLogin,cartController.loadCart);
router.post('/add-cart',auth.isLogin,upload.none(),cartController.add_to_cart);
router.post('/add-cart1',auth.isLogin,upload.none(),cartController.add_to_cart1);
router.post('/update-cart',auth.isLogin,cartController.updateCart);
router.patch('/delete-product',auth.isLogin,cartController.deleteProduct);

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
router.post('/verifyCoupon',auth.isLogin,couponController.verifyCoupon);


//wallet
router.get('/wallet',auth.isLogin,walletcontroller.loadWallet);

//invoice
router.get('/invoice',auth.isLogin,invoiceController.createInvoice);

router.get('/logout',userController.userLogout);
module.exports = router;