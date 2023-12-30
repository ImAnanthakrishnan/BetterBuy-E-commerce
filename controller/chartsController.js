const Order = require('../model/ordersModel');

const dailyBarChart = async(req,res)=>{
    try{
      
      const today = new Date();
      const startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const endDate =  new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
      const dailyOrders = await Order.find({
          createdAt: { $gte: startDate, $lt: endDate }
        }).populate('product.productId')
   console.log(dailyOrders)
        const averageQuantities = [];
        const productNames = [];

        const productDataMap = new Map();

        for (const order of dailyOrders) {
          // Iterate through each product in the order
          for (const product of order.product) {
            const productId = product.productId.toString();
            const quantity = product.quantity;
           const name = product.name;
            // Check if the product already exists in the map
            if (!productDataMap.has(productId)) {
              productDataMap.set(productId, { totalQuantity: 0, count: 0, name });
            }
        
            // Increment the total quantity and count
            productDataMap.get(productId).totalQuantity += quantity;
            productDataMap.get(productId).count++;
            productDataMap.get(productId).name = name;
          }
        }


        productDataMap.forEach((data, productId) => {
          const averageQuantity = data.totalQuantity /// data.count;
          averageQuantities.push(averageQuantity);
        
          const productName = data.name;
          productNames.push(productName);
        });

        const sortedIndexes = averageQuantities
          .map((_, index) => index)
          .sort((a, b) => averageQuantities[b] - averageQuantities[a]);

          const top5AverageQuantities = sortedIndexes.slice(0, 5).map((index) => averageQuantities[index]);
          const top5ProductNames = sortedIndexes.slice(0, 5).map((index) => productNames[index]);

          console.log("Top 5 Average Quantities:", top5AverageQuantities);
          console.log("Corresponding Product Names:", top5ProductNames);

          const response = {
              top5AverageQuantities,
              top5ProductNames
          }
          res.status(200).json(response);

    }
    catch(err){
        console.log(err.message);
    }
}

const weeklyBarChart = async(req,res)=>{
    try{
      const today = new Date();
      const startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay());
      const endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() + 7);
      const weeklyOrders = await Order.find({
          createdAt: { $gte: startDate, $lt: endDate }
        }).populate('product.productId')
    console.log(weeklyOrders)
        const averageQuantities = [];
        const productNames = [];

        const productDataMap = new Map();

        for (const order of weeklyOrders) {
          // Iterate through each product in the order
          for (const product of order.product) {
            const productId = product.productId.toString();
            const quantity = product.quantity;
           const name = product.name;
            // Check if the product already exists in the map
            if (!productDataMap.has(productId)) {
              productDataMap.set(productId, { totalQuantity: 0, count: 0, name });
            }
        
            // Increment the total quantity and count
            productDataMap.get(productId).totalQuantity += quantity;
            productDataMap.get(productId).count++;
            productDataMap.get(productId).name = name;
          }
        }


        productDataMap.forEach((data, productId) => {
          const averageQuantity = data.totalQuantity /// data.count;
          averageQuantities.push(averageQuantity);
        
          const productName = data.name;
          productNames.push(productName);
        });

        const sortedIndexes = averageQuantities
          .map((_, index) => index)
          .sort((a, b) => averageQuantities[b] - averageQuantities[a]);

          const top5AverageQuantities = sortedIndexes.slice(0, 5).map((index) => averageQuantities[index]);
          const top5ProductNames = sortedIndexes.slice(0, 5).map((index) => productNames[index]);

          console.log("Top 5 Average Quantities:", top5AverageQuantities);
          console.log("Corresponding Product Names:", top5ProductNames);

          const response = {
              top5AverageQuantities,
              top5ProductNames
          }
          res.status(200).json(response);

    }
    catch(err){
        console.log(err.message);
    }
}

const monthlyBarChart = async(req,res)=>{
    try{
        
        const today = new Date();
        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
        const monthlyOrders = await Order.find({
            createdAt: { $gte: firstDayOfMonth, $lt: lastDayOfMonth }
          }).populate('product.productId')
          const averageQuantities = [];
          const productNames = [];

          const productDataMap = new Map();

          for (const order of monthlyOrders) {
            // Iterate through each product in the order
            for (const product of order.product) {
              const productId = product.productId.toString();
              const quantity = product.quantity;
             const name = product.name;
              // Check if the product already exists in the map
              if (!productDataMap.has(productId)) {
                productDataMap.set(productId, { totalQuantity: 0, count: 0, name });
              }
          
              // Increment the total quantity and count
              productDataMap.get(productId).totalQuantity += quantity;
              productDataMap.get(productId).count++;
              productDataMap.get(productId).name = name;
            }
          }


          productDataMap.forEach((data, productId) => {
            const averageQuantity = data.totalQuantity /// data.count;
            averageQuantities.push(averageQuantity);
          
            const productName = data.name;
            productNames.push(productName);
          });

          const sortedIndexes = averageQuantities
            .map((_, index) => index)
            .sort((a, b) => averageQuantities[b] - averageQuantities[a]);

            const top5AverageQuantities = sortedIndexes.slice(0, 5).map((index) => averageQuantities[index]);
            const top5ProductNames = sortedIndexes.slice(0, 5).map((index) => productNames[index]);

            console.log("Top 5 Average Quantities:", top5AverageQuantities);
            console.log("Corresponding Product Names:", top5ProductNames);

            const response = {
                top5AverageQuantities,
                top5ProductNames
            }
            res.status(200).json(response);

    }
    catch(err){
        console.log(err.message);
    }
}

const yearlyBarChart = async(req,res)=>{
    try{

      const today = new Date();
      const firstDayOfYear =  new Date(today.getFullYear(), 0, 1);
      const lastDayOfYear =  new Date(today.getFullYear() + 1, 0, 1); 
      const yearlyOrders = await Order.find({
        createdAt: { $gte: firstDayOfYear, $lt: lastDayOfYear }
      })
      const averageQuantities = [];
      const productNames = [];

      const productDataMap = new Map();

      for (const order of yearlyOrders) {
        // Iterate through each product in the order
        for (const product of order.product) {
          const productId = product.productId.toString();
          const quantity = product.quantity;
         const name = product.name;
          // Check if the product already exists in the map
          if (!productDataMap.has(productId)) {
            productDataMap.set(productId, { totalQuantity: 0, count: 0, name });
          }
      
          // Increment the total quantity and count
          productDataMap.get(productId).totalQuantity += quantity;
          productDataMap.get(productId).count++;
          productDataMap.get(productId).name = name;
        }
      }


      productDataMap.forEach((data, productId) => {
        const averageQuantity = data.totalQuantity /// data.count;
        averageQuantities.push(averageQuantity);
      
        const productName = data.name;
        productNames.push(productName);
      });

      const sortedIndexes = averageQuantities
        .map((_, index) => index)
        .sort((a, b) => averageQuantities[b] - averageQuantities[a]);

        const top5AverageQuantities = sortedIndexes.slice(0, 5).map((index) => averageQuantities[index]);
        const top5ProductNames = sortedIndexes.slice(0, 5).map((index) => productNames[index]);

        console.log("Top 5 Average Quantities:", top5AverageQuantities);
        console.log("Corresponding Product Names:", top5ProductNames);

        const response = {
            top5AverageQuantities,
            top5ProductNames
        }
        res.status(200).json(response);

    }
    catch(err){
        console.log(err.message);
    }
}


const dailyAreaChart = async(req,res)=>{
  try{

    const today = new Date();
    const startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endDate =  new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    const dailyPurchase = await Order.find({createdAt: { $gte: startDate, $lt: endDate }});
    const dailySales = await Order.find({createdAt: { $gte: startDate, $lt: endDate },status:'Delivered'});


  }
  catch(err){
    console.log(err.message);
  }
}


const weeklyAreaChart = async (req, res) => {
  try {
    const getDailyCounts = async (year, month, week) => {
      const dailySalesCounts = [];
      const dailyPurchaseCounts = [];
      const dayLabels = [];

      // Find the minimum and maximum days present in the data for the specified month and year
      const minDay = await Order.aggregate([
        {
          $match: {
            createdAt: {
              $gte: new Date(year, month - 1, 1),
              $lt: new Date(year, month, 1),
            },
          },
        },
        {
          $group: {
            _id: {
              $dayOfMonth: "$createdAt",
            },
          },
        },
        {
          $sort: {
            "_id": 1,
          },
        },
        {
          $limit: 1,
        },
      ]).then((days) => days[0]?._id);

      const maxDay = await Order.aggregate([
        {
          $match: {
            createdAt: {
              $gte: new Date(year, month - 1, 1),
              $lt: new Date(year, month, 1),
            },
          },
        },
        {
          $group: {
            _id: {
              $dayOfMonth: "$createdAt",
            },
          },
        },
        {
          $sort: {
            "_id": -1,
          },
        },
        {
          $limit: 1,
        },
      ]).then((days) => days[0]?._id);

      if (minDay === undefined || maxDay === undefined) {
        // No data available, handle accordingly
        return {
          dailyPurchaseCounts,
          dailySalesCounts,
          dayLabels,
        };
      }

      const firstDayOfWeek = (week - 1) * 7 + 1; // Assuming the week starts from 1
      const lastDayOfWeek = firstDayOfWeek + 6;

      for (let day = firstDayOfWeek; day <= lastDayOfWeek; day++) {
        if (day >= minDay && day <= maxDay) {
          const firstDayOfDay = new Date(year, month - 1, day);
          const lastDayOfDay = new Date(year, month - 1, day + 1);

          const purchaseCount = await Order.find({
            createdAt: { $gte: firstDayOfDay, $lt: lastDayOfDay },
          }).count();

          const salesCount = await Order.find({
            createdAt: { $gte: firstDayOfDay, $lt: lastDayOfDay },
            status: 'Delivered',
          }).count();

          dailyPurchaseCounts.push(purchaseCount);
          dailySalesCounts.push(salesCount);
          dayLabels.push(`Day ${day}`);
        }
      }

      return {
        dailyPurchaseCounts,
        dailySalesCounts,
        dayLabels,
      };
    };

    try {
      // Example usage for a specific week in a specific month and year
      const resultDays = await getDailyCounts(2023, 12, 2); // Replace with your desired year, month, and week
      console.log("Daily Purchase Counts:", resultDays.dailyPurchaseCounts);
      console.log("Daily Sales Counts:", resultDays.dailySalesCounts);
      console.log("Day Labels:", resultDays.dayLabels);

      const responseDays = {
        purchase: resultDays.dailyPurchaseCounts,
        sales: resultDays.dailySalesCounts,
        month: resultDays.dayLabels,
      };
      res.status(200).json(responseDays);
    } catch (err) {
      console.log(err.message);
    }
  } catch (err) {
    console.log(err.message);
  }
};






/*const weeklyAreaChart = async(req,res)=>{
  try{

    const getWeeklyCounts = async () => {
      console.log('adf');
      const today = new Date();
      const year = today.getFullYear()+1;
      const weeklySalesCounts = [];
      const weeklyPurchaseCounts = [];
      const weekLabels = [];
    
      // Find the minimum and maximum weeks present in the data
      const minWeek = await Order.aggregate([
        {
          $group: {
            _id: {
              $week: "$createdAt"
            }
          }
        },
        {
          $sort: {
            "_id": 1
          }
        },
        {
          $limit: 1
        }
      ]).then(weeks => weeks[0]?._id);
    
      const maxWeek = await Order.aggregate([
        {
          $group: {
            _id: {
              $week: "$createdAt"
            }
          }
        },
        {
          $sort: {
            "_id": -1
          }
        },
        {
          $limit: 1
        }
      ]).then(weeks => weeks[0]?._id);
    
      if (minWeek === undefined || maxWeek === undefined) {
        // No data available, handle accordingly
        return {
          weeklyPurchaseCounts,
          weeklySalesCounts,
          weekLabels
        };
      }
    
      for (let week = minWeek; week <= maxWeek; week++) {
        const firstDayOfWeek = new Date(year, 0, 1 + (week - 1) * 7);
        const lastDayOfWeek = new Date(year, 0, 1 + week * 7);
    
        const purchaseCount = await Order.find({
          createdAt: { $gte: firstDayOfWeek, $lt: lastDayOfWeek }
        }).count();
    
        const salesCount = await Order.find({
          createdAt: { $gte: firstDayOfWeek, $lt: lastDayOfWeek },
          status: 'Delivered'
        }).count();
    
        weeklyPurchaseCounts.push(purchaseCount);
        weeklySalesCounts.push(salesCount);
        weekLabels.push(`Week ${week}`);
      }
    
      return {
        weeklyPurchaseCounts,
        weeklySalesCounts,
        weekLabels
      };
    };
    
    try {
      // Example usage for weeks
      const resultWeeks = await getWeeklyCounts();
      console.log("Weekly Purchase Counts:", resultWeeks.weeklyPurchaseCounts);
      console.log("Weekly Sales Counts:", resultWeeks.weeklySalesCounts);
      console.log("Week Labels:", resultWeeks.weekLabels);
    
      const responseWeeks = {
        purchase: resultWeeks.weeklyPurchaseCounts,
        sales: resultWeeks.weeklySalesCounts,
        months: resultWeeks.weekLabels
      }
      res.status(200).json(responseWeeks)

      }
       catch(err){
        console.log(err.message);
       }

  }
  catch(err){
    console.log(err.message);
  }
}*/

const monthlyAreaChart = async(req,res)=>{
  try{

    console.log('helo')
    const getMonthlyCounts = async () => {
      console.log('adf')
      const today = new Date();
      const year = today.getFullYear();
      const monthlySalesCounts = [];
      const monthlyPurchaseCounts = [];
      const monthLabels = [];
    
      // Find the minimum and maximum months present in the data
     // const minMonth = await Order.find().sort({ createdAt: 1 }).limit(1).then(orders => orders[0]?.createdAt.getMonth());
     // const maxMonth = await Order.find().sort({ createdAt: -1 }).limit(1).then(orders => orders[0]?.createdAt.getMonth());

     const targetYear = 2023; // Change this to the desired year

const startOfYear = new Date(targetYear, 0, 1);
const endOfYear = new Date(targetYear + 1, 0, 0);

const minMonth = await Order.find({ createdAt: { $gte: startOfYear, $lt: endOfYear } }).sort({ createdAt: 1 }).limit(1).then(orders => orders[0]?.createdAt.getMonth());
const maxMonth = await Order.find({ createdAt: { $gte: startOfYear, $lt: endOfYear } }).sort({ createdAt: -1 }).limit(1).then(orders => orders[0]?.createdAt.getMonth());

console.log(minMonth);
console.log(maxMonth);



     console.log(minMonth);
     console.log(maxMonth);
      if (minMonth === undefined || maxMonth === undefined) {
        // No data available, handle accordingly
        return {
          monthlyPurchaseCounts,
          monthlySalesCounts,
          monthLabels
        };
      }
    
      for (let month = minMonth; month <= maxMonth; month++) {
        const firstDayOfMonth = new Date(year, month, 1);
        const lastDayOfMonth = new Date(year, month + 1, 0);
    
        const purchaseCount = await Order.find({
          createdAt: { $gte: firstDayOfMonth, $lt: lastDayOfMonth }
        }).count();
    
        const salesCount = await Order.find({
          createdAt: { $gte: firstDayOfMonth, $lt: lastDayOfMonth },
          status: 'Delivered'
        }).count();
    
        monthlyPurchaseCounts.push(purchaseCount);
        monthlySalesCounts.push(salesCount);
        monthLabels.push(firstDayOfMonth.toLocaleString('en-US', { month: 'long' }));
      }
    
      return {
        monthlyPurchaseCounts,
        monthlySalesCounts,
        monthLabels
      };
    };
    
    // Example usage
    const result = await getMonthlyCounts();
    console.log("Monthly Purchase Counts:", result.monthlyPurchaseCounts);
    console.log("Monthly Sales Counts:", result.monthlySalesCounts);
    console.log("Month Labels:", result.monthLabels);

    const response = {
      purchase:result.monthlyPurchaseCounts,
      sales:result.monthlySalesCounts,
      months:result.monthLabels
  }
  res.status(200).json(response);
  
}catch(err){
  console.log(err.message);
}
}

/*const { startOfWeek, endOfWeek, addWeeks, format } = require('date-fns');

const monthlyAreaChart = async (req, res) => {
  try {
    const getWeeklyCounts = async () => {
      const today = new Date();
      const year = today.getFullYear();
      const month = today.getMonth() + 1; // Month is zero-based, so add 1
      const weeklySalesCounts = [];
      const weeklyPurchaseCounts = [];
      const weekLabels = [];

      // Find the minimum and maximum weeks present in the data for the current month
      const minWeek = await Order.aggregate([
        {
          $match: {
            $expr: {
              $and: [
                { $eq: [{ $year: "$createdAt" }, year] },
                { $eq: [{ $month: "$createdAt" }, month] }
              ]
            }
          }
        },
        {
          $group: {
            _id: {
              $isoWeek: "$createdAt"
            }
          }
        },
        {
          $sort: {
            "_id": 1
          }
        },
        {
          $limit: 1
        }
      ]).then((weeks) => weeks[0]?._id);

      const maxWeek = await Order.aggregate([
        {
          $match: {
            $expr: {
              $and: [
                { $eq: [{ $year: "$createdAt" }, year] },
                { $eq: [{ $month: "$createdAt" }, month] }
              ]
            }
          }
        },
        {
          $group: {
            _id: {
              $isoWeek: "$createdAt"
            }
          }
        },
        {
          $sort: {
            "_id": -1
          }
        },
        {
          $limit: 1
        }
      ]).then((weeks) => weeks[0]?._id);

      if (minWeek === undefined || maxWeek === undefined) {
        // No data available, handle accordingly
        return {
          weeklyPurchaseCounts,
          weeklySalesCounts,
          weekLabels
        };
      }

      for (let week = minWeek; week <= maxWeek; week++) {
        const firstDayOfWeek = startOfWeek(new Date(year, month - 1, 1), { weekStartsOn: 1 });
        const lastDayOfWeek = endOfWeek(addWeeks(firstDayOfWeek, 1));

        const purchaseCount = await Order.find({
          createdAt: { $gte: firstDayOfWeek, $lt: lastDayOfWeek }
        }).count();

        const salesCount = await Order.find({
          createdAt: { $gte: firstDayOfWeek, $lt: lastDayOfWeek },
          status: 'Delivered'
        }).count();

        weeklyPurchaseCounts.push(purchaseCount);
        weeklySalesCounts.push(salesCount);
        weekLabels.push(`Week ${week}`);
      }

      return {
        weeklyPurchaseCounts,
        weeklySalesCounts,
        weekLabels
      };
    };

    try {
      // Example usage for weeks
      const resultWeeks = await getWeeklyCounts();
      console.log("Weekly Purchase Counts:", resultWeeks.weeklyPurchaseCounts);
      console.log("Weekly Sales Counts:", resultWeeks.weeklySalesCounts);
      console.log("Week Labels:", resultWeeks.weekLabels);

      const responseWeeks = {
        purchase: resultWeeks.weeklyPurchaseCounts,
        sales: resultWeeks.weeklySalesCounts,
        months: resultWeeks.weekLabels
      };
      res.status(200).json(responseWeeks);
    } catch (err) {
      console.log(err.message);
      res.status(500).send('Internal Server Error');
    }
  } catch (err) {
    console.log(err.message);
  }
};
*/

const yearlyAreaChart = async (req, res) => {
  try {
    console.log('hello');
    const getYearlyCounts = async () => {
      console.log('adf');
      const today = new Date();
      const currentYear = today.getFullYear();
      const startYear = 2019; // Change this to the start year in your database
      const yearlySalesCounts = [];
      const yearlyPurchaseCounts = [];
      const yearLabels = [];

      for (let year = startYear; year <= currentYear; year++) {
        const firstDayOfYear = new Date(year, 0, 1);
        const lastDayOfYear = new Date(year + 1, 0, 0);

        const purchaseCount = await Order.find({
          createdAt: { $gte: firstDayOfYear, $lt: lastDayOfYear }
        }).count();

        const salesCount = await Order.find({
          createdAt: { $gte: firstDayOfYear, $lt: lastDayOfYear },
          status: 'Delivered'
        }).count();

        yearlyPurchaseCounts.push(purchaseCount);
        yearlySalesCounts.push(salesCount);
        yearLabels.push(year.toString());
      }

      return {
        yearlyPurchaseCounts,
        yearlySalesCounts,
        yearLabels
      };
    };

    // Example usage
    const result = await getYearlyCounts();
    console.log("Yearly Purchase Counts:", result.yearlyPurchaseCounts);
    console.log("Yearly Sales Counts:", result.yearlySalesCounts);
    console.log("Year Labels:", result.yearLabels);

    const response = {
      purchase: result.yearlyPurchaseCounts,
      sales: result.yearlySalesCounts,
      months: result.yearLabels
    };
    res.status(200).json(response);

  } catch (err) {
    console.log(err.message);
    res.status(500).send('Internal Server Error');
  }
};



/*const yearlyAreaChart = async(req,res)=>{
  try{


    console.log('helo')
    const getMonthlyCounts = async () => {
      console.log('adf')
      const today = new Date();
      const year = today.getFullYear();
      const monthlySalesCounts = [];
      const monthlyPurchaseCounts = [];
      const monthLabels = [];
    
      // Find the minimum and maximum months present in the data
      const minMonth = await Order.find().sort({ createdAt: 1 }).limit(1).then(orders => orders[0]?.createdAt.getMonth());
      const maxMonth = await Order.find().sort({ createdAt: -1 }).limit(1).then(orders => orders[0]?.createdAt.getMonth());
    
      if (minMonth === undefined || maxMonth === undefined) {
        // No data available, handle accordingly
        return {
          monthlyPurchaseCounts,
          monthlySalesCounts,
          monthLabels
        };
      }
    
      for (let month = minMonth; month <= maxMonth; month++) {
        const firstDayOfMonth = new Date(year, month, 1);
        const lastDayOfMonth = new Date(year, month + 1, 0);
    
        const purchaseCount = await Order.find({
          createdAt: { $gte: firstDayOfMonth, $lt: lastDayOfMonth }
        }).count();
    
        const salesCount = await Order.find({
          createdAt: { $gte: firstDayOfMonth, $lt: lastDayOfMonth },
          status: 'Delivered'
        }).count();
    
        monthlyPurchaseCounts.push(purchaseCount);
        monthlySalesCounts.push(salesCount);
        monthLabels.push(firstDayOfMonth.toLocaleString('en-US', { month: 'long' }));
      }
    
      return {
        monthlyPurchaseCounts,
        monthlySalesCounts,
        monthLabels
      };
    };
    
    // Example usage
    const result = await getMonthlyCounts();
    console.log("Monthly Purchase Counts:", result.monthlyPurchaseCounts);
    console.log("Monthly Sales Counts:", result.monthlySalesCounts);
    console.log("Month Labels:", result.monthLabels);

    const response = {
      purchase:result.monthlyPurchaseCounts,
      sales:result.monthlySalesCounts,
      months:result.monthLabels
  }
  res.status(200).json(response);

  }
  catch(err){
    console.log(err.message);
  }
}*/

module.exports = {dailyBarChart,weeklyBarChart,monthlyBarChart,yearlyBarChart,
dailyAreaChart,weeklyAreaChart,monthlyAreaChart,yearlyAreaChart};