const Category = require('../model/categoryModel')



const loadCategory = async(req,res)=>{
    try{
        const categoryData = await Category.find().lean()
        res.render('admin/category',{title:'category',categoryData,admin:true,style:'admin.css'})
    }
    catch(err){
        console.log(err.message);
    }
}

const addCategoryLoad = async(req,res)=>{
    try{
        res.render('admin/add-category',{title:'addCategory',style:'admin.css',admin:true})
    }
    catch(err){
        console.log(err.message)
    }
}

const addCategory = async(req,res)=>{
    try{
        const Category_data = await Category.find();
        if(Category_data.length>0){
            let checking=false;
            for(let i=0;i<Category_data.length;i++){
                if(Category_data[i]['category'].toLowerCase() === req.body.category.toLowerCase()){
                    checking=true;
                    break;
                }
            }
            if(checking == false){

                const categoryy =  new Category({
                    category : req.body.category,
                    image : req.file.filename
                });
                const cat_data = await categoryy.save();
                res.render('admin/add-category',{message:'Sucess',err:true,style:'admin.css',admin:true})
            }else{
                res.render('admin/add-category',{message:'This category already exists',err:true,admin:true,style:'admin.css'})
            }
          
        }
        else{
                        
        }
    }
    catch(err){
        //throw new Error(err)
        console.log(err.message)
    }
}

const editLoadCategory = async(req,res)=>{
    try{
        const id = req.query.id;
        const categoryData = await Category.findById({_id:id}).lean()
       
        if(categoryData){
            res.render('admin/edit-category',{title:'edit-category',category:categoryData,admin:true,style:'admin.css'})
        }else{
            res.redirect('/admin');
        }
    }   
    catch(err){
        console.log(err.message);
    }
}

const updateCategory = async(req,res)=>{
    try{
        const Category_data = await Category.find();
        //console.log(Category_data)
        //console.log(Category_data.length)
        if(Category_data.length>0){
            let checking=false;
            for(let i=0;i<Category_data.length;i++){
                if(Category_data[i]['category'].toLowerCase() === req.body.category.toLowerCase()){
                    checking=true;
                    break;
                }
            }
            if(checking == false){

                const categoryData = await Category.findByIdAndUpdate({_id:req.body.id},{$set:{category:req.body.category,image:req.file.filename}})
                res.redirect('/admin/category')
                
            }else{
                res.render('admin/add-category',{message:'This category already exists',err:true,admin:true,style:'admin.css'})
            }
          
        }
        else{
          
        }

      
    }
    catch(err){
        console.log(err.message);
    }
}

const deleteCategory = async(req,res)=>{
    try{
        const id = req.query.id;
        const category = await Category.findByIdAndUpdate({_id:id},{is_disabled:true});
        res.redirect('/admin/category')
    }
    catch(err){
        console.log(err.message)
    }
}
module.exports = {loadCategory,addCategoryLoad,addCategory,editLoadCategory,updateCategory,deleteCategory}