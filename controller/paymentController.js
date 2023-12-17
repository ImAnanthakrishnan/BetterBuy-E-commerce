



/*const createOrder = async(req,res)=>{
    try{
        const amount = req.body.price*100;
        const options = {
            amount : amount,
            currency : 'INR',
            receipt : 'letsbetterbuy@gmail.com'
        }
        razorpayInstance.orders.create.create(options,
            (err,order)=>{
                if(!err){
                    res.status(200).json({
                        success:true,
                        msg:'Order Placed',
                        amount:amount,
                        key_id:RAZORPAY_ID_KEY,
                        product_name:req.body.name,
                        contact:req.body.phone,
                        name:req.body.fname,
                    });
                }else{
                    res.status(400).json({success:false,msg:'Something went wrong'});
                }
            })
    }
    catch(err){
        console.log(err.message);
        res.status(500).json({error:'Internal server error'});
    }
}*/