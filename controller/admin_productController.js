const Product = require('../model/productModel');
const Category = require('../model/categoryModel')
const sharp = require('sharp');

const loadProduct = async(req,res)=>{
    try{
       
        const productData = await Product.find().populate('category_id').lean()
       
        if(productData.status == 'available'){
            var status=true
        }
        res.render('admin/products',{title:'Product',productData,style:'admin.css',admin:true,status})
    }
    catch(err){
        console.log(err.message)
    }
}

const loadAddProduct = async(req,res)=>{
    try{
        const cat_data = await Category.find().lean();
       // console.log(cat_data)
      
        res.render('admin/add-product',{title:'addProducts',cat_data,admin:true,style:'admin.css'})
    }
    catch(err){
        console.log(err.message)
    }
}


const addProduct = async(req,res)=>{
    try{
        const arrImages = req.files.map(file => file.filename);
      console.log(arrImages)
        const cropperImage = await Promise.all(
            arrImages.map(async(image)=>{
                try{
                const outputImage = `./public/images/cropped_${image}`;
                console.log(outputImage)
                const imageInfo = await sharp('./public/images/' + image).metadata();
                const { width, height } = imageInfo;
                await sharp('./public/images/' + image)
                .extract({left:0,top:0,width:Math.min(width,300),height:Math.min(height,300)})
                .flatten({ background: { r: 255, g: 245, b: 238, alpha: 1 } })
                .jpeg()
                .toFile(outputImage);

                return `cropped_${image}`;
            }catch(error){
                console.log('Error during image extraction:',error.message);
                throw error;
            }
            })
        );

       const product =  new Product({
            name:req.body.name,
            status:req.body.status,
            quantity:req.body.quantity,
            price:req.body.price,
            description:req.body.description,
            images:cropperImage,
            category_id:req.body.category_id, 

        });
        const product_data = await product.save();
        const cat_data = await Category.find().lean();
       
        if(product_data){
            res.render('admin/add-product',{message:'Success',err:true,cat_data,admin:true,style:'admin.css'})
        }else{
            res.render('admin/add-product',{message:'Error',err:true,cat_data,admin:true,style:'admin.css'})
        }
      
       
    }
    catch(err){
      console.log(err.message)
    }
}

const editProductLoad = async(req,res)=>{
    try{
        const cat_data = await Category.find().lean();
        // console.log(cat_data)
        
        const id = req.query.id;
        const productData = await Product.findById({_id:id}).populate('category_id').lean();
      
        res.render('admin/edit-product',{product:productData,cat_data,admin:true,style:'admin.css'})
    }
    catch(err){
        console.log(err.message)
    }
}

const updateProduct = async(req,res)=>{
    try{
        const id=req.body.id;
        
       
        const product = await Product.findById({_id:id});
       const images = product.images;
   

       const arrImages = req.files.map(file => file.filename);
    
        const available = 3-images.length;
     
        const newImages = arrImages.slice(0,available);

      
      

        product.images = images.concat(newImages);
  console.log(product.images)
        const cropperImage = await Promise.all(
            product.images.map(async(image)=>{
                try{
                const outputImage = `./public/images/cropped_${image}`;
                console.log(outputImage)
                const imageInfo = await sharp('./public/images/' + image).metadata();
                const { width, height } = imageInfo;
                await sharp('./public/images/' + image)
                .extract({left:0,top:0,width:Math.min(width,300),height:Math.min(height,300)})
                .flatten({ background: { r: 255, g: 245, b: 238, alpha: 1 } })
                .jpeg()
                .toFile(outputImage);

                return `cropped_${image}`;
            }catch(error){
                console.log('Error during image extraction:',error.message);
                throw error;
            }
            })
        );

       
        const updateProduct = await Product.findByIdAndUpdate({_id:req.body.id},{$set:{name:req.body.name,status:req.body.status,price:req.body.price,description:req.body.description,images:cropperImage,category_id:req.body.category_id}});
       if(updateProduct){
        res.redirect('/admin/product');
       }
        
    }   
    catch(err){
        console.log(err.message)
    }
}

const deleteProduct = async(req,res)=>{
    try{
        const id = req.query.id;
        const product = await Product.findByIdAndUpdate({_id:id},{is_disabled:true});
        res.redirect('/admin/product')
    }
    catch(err){
        console.log(err.message)
    }
}

const deleteImage = async(req,res)=>{
    try{
  
        const productId = req.query.pro;
        const imgIndex = req.query.img;
        const product = await Product.findById({_id:productId});
    if (product) {
      // Remove the image at the specified index
      product.images.splice(imgIndex, 1);
      await product.save();
    }  
    res.redirect(`/admin/edit-product?id=${productId}`);
 
        //console.log(idToRemove,productId)
        /*const product = await Product.updateOne(
            { _id: productId },
            { $pull: { images: idToRemove } }
          );*/
        
    }
    catch(err){
        console.log(err.message)
    }
}



module.exports = {loadProduct,loadAddProduct,addProduct,editProductLoad,updateProduct,deleteProduct,
deleteImage}