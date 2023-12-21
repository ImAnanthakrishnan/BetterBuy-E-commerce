const excel = require('exceljs');
const puppeter = require('puppeteer');
const fs = require('fs-extra');
const path = require('path');
const hbs = require('handlebars');

const Order = require('../model/ordersModel');

const loadReport = async(req,res)=>{
    try{
        const orderDatas = await Order.find({status:'Delivered'}).populate('product.productId').lean();
        const orderData = orderDatas.map(order => {
            return {
                ...order,
                createdAt: new Date(order.createdAt).toLocaleDateString()
            };
        });

        res.render('admin/report',{title:'Report',admin:true,style:'admin.css',orderData});
    }
    catch(err){
        console.log(err.message);
    }
}


const exportExcelOrders = async(req,res)=>{
    try{
        const orders = await Order.find({status:'Delivered'});
        //const products = orders.map(order => order.product);
        console.log(orders);
      //  console.log(products)
       const data = [];
              orders.forEach(order => {
                const productDetails = order.product.map(product => `${product.name} (Qty: ${product.quantity}, Price: ${product.price})`).join(', ');
            // order.product.forEach(product => {
             order.address.forEach(address=>{
              data.push({
                //s_no: order.s_no,
                fullname: order.fullname,
                phone: order.phone,
                paymentMethod: order.paymentMethod,
                status: order.status,
                productDetails: productDetails,
              //  productName: product.name,
               // quantity: product.quantity,
               // price: product.price,
                address: address.address,
                district: address.district,
                city: address.city,
                pincode: address.pincode,
                state: address.state,
                country: address.country,
              });
            })
            });
        //  });
  console.log(data);

        const workbook = new excel.Workbook();
       const worksheet = workbook.addWorksheet("Orders");
        worksheet.columns = [
           // { header: "S no.", key: "s_no" },
            { header: "Fullname", key: "fullname",width:20 },
            { header: "Phone", key: "phone",width:10,numFmt:'0' },
            { header: "Payment Method", key: "paymentMethod",width:5 },
            { header: "Status", key: "status",width:10 },
            { header: "Product Details", key: "productDetails", width: 30  },
           // {header: "P.Name",key:"productName",width:15},
            //{ header: "Quantity", key: "quantity",width:5 },
            //{ header: "P.Price", key: "price",width:5 },
            { header: "Address", key: "address",width:30 },
            { header: "District", key: "district",width:15 },
            { header: "City", key: "city",width:15 },
            { header: "Pincode", key: "pincode",width:10 },
            { header: "State", key: "state",width:15 },
            { header: "Country", key: "country",width:15 }, 
        ];
      //  let counter1 = 1;
       data.forEach((order) => {
       // order.s_no=counter1;
       const row = worksheet.addRow(order);
       // counter1++
       row.height = 30
       });
      worksheet.getRow(1).eachCell((cell)=>{
        cell.font = {bold:true}
        worksheet.getRow(1).height = 20;
      });
       
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );

      res.setHeader("Content-Disposition",`attachment; filename = orders.xlsx`);
      return workbook.xlsx.write(res).then(()=>{
        res.status(200).end();
      });

    }
    catch(err){
        console.log(err.message);
    }
}

const compile = async function(templateName,data){
    const filePath = path.join(process.cwd(),'views','admin',`${templateName}.hbs`)

    const html  = await fs.readFile(filePath,'utf8');

    return hbs.compile(html)(data)
}

const exportPdfOrders = async(req,res)=>{
    try{

        
    const browser = await puppeter.launch();

    const page = await browser.newPage();

        const orderDatas = await Order.find({status:'Delivered'}).populate('product.productId').lean();
        const orderData = orderDatas.map(order => {
            return {
                ...order,
                createdAt: new Date(order.createdAt).toLocaleDateString()
            };
        });



    const content = await compile('pdf',{orderData:orderData});

    await page.setContent(content);

    const pdfBuffer = await page.pdf({
       // path:'output.pdf',
        format: 'A4',
        printBackground:true
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=output.pdf');

    res.send(pdfBuffer);

    console.log('done creating pdf');

    await browser.close();

    //process.exit();
    }
    catch(err){
        console.log(err.message);
    }
}

module.exports = {loadReport,exportExcelOrders,exportPdfOrders};