const Order = require('../model/ordersModel');
const Wallet = require('../model/walletModel');

const loadWallet = async(req,res)=>{
    try{
        const log = req.session.user_id;
        const orderData = await Order.find({userId:log});

        const filteredData = orderData.filter(order=>order.is_cancelled === true && order.paymentMethod!=='COD' || order.is_cancelled === true && order.is_return === true );
        const creditData = orderData.filter(order=>order.paymentMethod === 'WALLET');

            const wallet = await Wallet.findOne({userId:log}).lean();
            console.log(wallet);

            const data = filteredData.map(order=>order.toObject());
            const data1 = creditData.map(order=>order.toObject());
            res.render('user/wallet',{title:'Wallet',user:true,style:'style.css',log,data,wallet,data1});
            

    }
    catch(err){
        console.log(err.message);
        res.status(500).json({error:'Internal server error'})
    }
}

module.exports = {loadWallet};