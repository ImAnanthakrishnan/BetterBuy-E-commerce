const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path')
const auth = require('../middleware/adminauth')
const adminController = require('../controller/adminController');
const categoryController = require('../controller/categoryController');
const product_controller = require('../controller/admin_productController');
const userController = require('../controller/admin_userController');
const inventoryController = require('../controller/inventoryController');
const orderController = require('../controller/adminOrderController');
const couponController = require('../controller/adminCouponController');
const reportController = require('../controller/salesReportController');
const offerController = require('../controller/adminOfferController');
const chartController = require('../controller/chartsController');
const locationController = require('../controller/location_controller');
const bannerController = require('../controller/bannerController');
const { route } = require('./user');

router.get('/', auth.isLogout, adminController.loadLogin);
router.post('/',auth.isLogout, adminController.verifyLogin);
router.get('/home', auth.isLogin, adminController.loadDashBoard)



router.use(express.static('public'))
//multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../public/images'))
    },
    filename: function (req, file, cb) {
        const name = Date.now() + '-' + file.originalname;
        cb(null, name);
    }
})
const upload = multer({ storage: storage });
const upload1 = multer();
//category
router.get('/category', auth.isLogin, categoryController.loadCategory);
router.get('/add-category', auth.isLogin, categoryController.addCategoryLoad)
router.post('/add-category',auth.isLogin, upload.single('image'), categoryController.addCategory);
router.get('/edit-category', auth.isLogin, categoryController.editLoadCategory);
router.post('/edit-category',auth.isLogin, upload.single('image'), categoryController.updateCategory);
router.get('/delete-category', auth.isLogin, categoryController.deleteCategory);

//product
router.get('/product', auth.isLogin, product_controller.loadProduct)
router.get('/add-product', auth.isLogin, product_controller.loadAddProduct)
router.post('/add-product',auth.isLogin ,upload.array('images', 3), product_controller.addProduct);
router.get('/edit-product', auth.isLogin, product_controller.editProductLoad);
router.post('/edit-product',auth.isLogin, upload.array('images', 3), product_controller.updateProduct)
router.get('/delete-product', auth.isLogin, product_controller.deleteProduct)
router.get('/delete-image', auth.isLogin, product_controller.deleteImage);

//user
router.get('/user', auth.isLogin, userController.loadUser);
router.get('/block-user', auth.isLogin, userController.blockUser);
router.get('/unblock-user', auth.isLogin, userController.unblockUser);


//inventory
router.get('/inventory', auth.isLogin, inventoryController.loadInventory);
router.get('/update-inventory', auth.isLogin, inventoryController.updateInventoryLoad);
router.patch('/update-inventory',auth.isLogin, upload1.none(), inventoryController.updateInventory)

//orders
router.get('/orders', auth.isLogin, orderController.orderDetails);
router.patch('/update-status',auth.isLogin, orderController.changeStatus)
router.get('/delete-order', auth.isLogin, orderController.deleteOrder);
router.patch('/refund', orderController.refund);

//coupons
router.get('/coupons', auth.isLogin, couponController.couponLoad);
router.get('/add-coupon', auth.isLogin, couponController.addCouponLoad)
router.post('/add-coupon',auth.isLogin, couponController.createCoupon);
router.get('/edit-coupon', auth.isLogin, couponController.loadEditCoupon);
router.post('/edit-coupon',auth.isLogin, couponController.editCoupons);
router.get('/delete-coupon', auth.isLogin, couponController.deleteCoupons);

//report
router.get('/reports', auth.isLogin, reportController.loadReport);
router.get('/export-ordersExcel', auth.isLogin, reportController.exportExcelOrders);
router.get('/export-ordersPdf', auth.isLogin, reportController.exportPdfOrders);

//offers
router.get('/offers', auth.isLogin, offerController.offerLoad);
router.get('/add-offers', auth.isLogin, offerController.addOffersLoad);
router.post('/add-offers',auth.isLogin, offerController.addOffers);

//charts
//router.get('/dailyBarChart',auth.isLogin,chartController.dailyBarChart);
router.get('/weeklyBarChart', auth.isLogin, chartController.weeklyBarChart);
router.get('/monthlyBarChart', auth.isLogin, chartController.monthlyBarChart);
router.get('/yearlyBarChart', auth.isLogin, chartController.yearlyBarChart);

//router.get('/dailyAreaChart',auth.isLogin,chartController.dailyAreaChart);
router.get('/weeklyAreaChart', auth.isLogin, chartController.weeklyAreaChart);
router.get('/monthlyAreaChart', auth.isLogin, chartController.monthlyAreaChart);
router.get('/yearlyAreaChart', auth.isLogin, chartController.yearlyAreaChart);

//location
router.get('/location', auth.isLogin, locationController.loadLocation);
router.get('/add-location', auth.isLogin, locationController.addLocationLoad);
router.post('/add-location',auth.isLogin, locationController.addLocation);
router.get('/edit-location', auth.isLogin, locationController.editLocationLoad);
router.post('/edit-location',auth.isLogin, locationController.editLocation);

//banner
router.get('/banner', auth.isLogin, bannerController.bannerLoad);
router.get('/add-banner', auth.isLogin, bannerController.addBannerLoad);
router.post('/add-banner',auth.isLogin, bannerController.addBanner);
router.get('/delete-banner',auth.isLogin,bannerController.deleteBanner);


router.get('/logout', adminController.adminLogout);
module.exports = router;