const easyinvoice = require('easyinvoice');
const fs = require('fs');
const Order = require('../model/ordersModel');

async function createInvoice(req,res) {
    try {
       const orderId = req.query.id;
       console.log(orderId)
        const orderData = await Order.findById(orderId)
        const order = {
            ...orderData.toObject(), // Convert Mongoose document to a plain JavaScript object
            createdAt: new Date(orderData.createdAt).toLocaleDateString()
        };
     const {address}=orderData;

     const adrs = address.map(addr => addr.address);
     const zip = address.map(addr => addr.pincode);
     const city = address.map(addr => addr.city);
     const district = address.map(addr => addr.district);
     const state = address.map(addr => addr.state);
     const country = address.map(addr => addr.country);
      // console.log(typeof(adrs))
        if (!order) {
            console.error('Order not found');
            return;
        }
        const shortenedOrderId = orderId.toString().substring(0, 6);
        // Populate the data object with order information
        const invoiceData = {
            // Customize, images, sender, client, information, etc. go here...
            "images": {
                // The logo on top of your invoice
               // "logo": "https://public.budgetinvoice.com/img/logo_en_original.png",
                // The invoice background
                "background": "https://public.easyinvoice.cloud/pdf/sample-background.pdf"
            },
            "sender": {
                "company": "BetterBuy",
                "address": "Sample Street 123",
                "zip": "1234 AB",
                "city": "Sampletown",
                "country": "Samplecountry"
            },
            "client": {
                "company": order.fullname,
                    "address":adrs,
                    "zip":zip,
                    "city":city,
                    "country":country
            
                
            },
            "information": {
                "number": `INV-${shortenedOrderId}`,

                "date": order.createdAt,
                //"due-date": order.dueDate,
             
            },
            "products": order.product.map(product => ({

              
                "quantity": product.quantity,
                 "description":product.name,
                 "tax-rate": 0,
                "price": product.price,
            })),
            "bottom-notice": "Thank you for your purchase",
            "settings": {
                "currency": "INR",
                "tax-notation": "GST"
            
            },
  
        };

   
       const result = await easyinvoice.createInvoice(invoiceData);

       // Send the PDF directly to the client
       res.setHeader('Content-Type', 'application/pdf');
       res.setHeader('Content-Disposition', `attachment; filename=invoice_${orderId}.pdf`);
       res.send(Buffer.from(result.pdf, 'base64'));


            console.log(`Invoice created for order ${orderId}.`);
        //});
    } catch (error) {
        console.error('Error creating invoice:', error);
    }
}

module.exports = {createInvoice};