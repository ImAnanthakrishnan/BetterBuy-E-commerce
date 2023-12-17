const Product = require('../model/productModel');
const search = async(req,res)=>{
    try{
   console.log('helo')
        console.log(req.body.searchItem);

        var search = '';
        if(req.body.searchItem){
            search = req.body.searchItem
        }
        const product = await Product.aggeragate([
            {
                $lookup:{
                    from:'Category',
                    localField:'category_id',
                    foreignField:'_id',
                    as:'category',
                },
            },
            {
                $match:{
                    $or:[
                        {name:{$regex: '.*' + search + '.*' , $options: 'i'}},
                        {'category.category':{$regex: '.*' + search + '.*' , $options: 'i'}},
                    ],
                },
            },
        ]).lean();
    
            const response = {
                product
            };
            res.status(200).json(response); 
  

    }
    catch(err){
        console.log(err.message);
        res.status(500).json({err:'Internal server error'});
    }
}

module.exports = {
    search
}