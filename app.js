const dotenv = require('dotenv');
dotenv.config({path:'./config.env'});
const express = require('express');
const logger = require('morgan');
const path = require('path');
const expbs = require('express-handlebars');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoute = require('./routes/user');
const adminRoute = require('./routes/admin')
const {errorHandler,notFound}=require('./middleware/errorHandler');
const app = express();


//view engine setup
app.set('views',path.join(__dirname,'views'));
app.set('view engine','hbs')

//loggermiddleware
//if(process.env.NODE_ENV === 'development'){
    app.use(logger('dev'));
//}

//bodyparsing
app.use(express.json());
app.use(express.urlencoded({extended:false}));

//cookie parsing
app.use(cookieParser())

//public files
app.use(express.static(path.join(__dirname,'public')));

app.engine(
    'hbs',
    expbs.engine({
      extname: 'hbs',
      defaultLayout: 'layout',
      layoutsDir: __dirname + '/views/layout/',
      partialsDir: __dirname + '/views/partials/',
      // Disable prototype access check
      allowProtoMethodsByDefault: true,
    })
  );


//mongoose

mongoose.connect(process.env.MONGODB_URL);

const db = mongoose.connection;

db.on('error', (error) => {
  console.error('MongoDB connection error:', error);
});

db.once('open', () => {
  console.log('Connected to MongoDB!');
});
//test
db.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

// Close the Mongoose connection if the Node process is terminated
process.on('SIGINT', () => {
  mongoose.connection.close();
  // () => {
  //   console.log('MongoDB connection closed through app termination');
  //   process.exit(0);
  // }
});

//ok

//session

app.use(session({
  secret:process.env.SECRET,
  resave:false,//session to save
  saveUninitialized:true,//session to to uninitialised to save and store
  cookie:{maxAge:7200000}
}));
app.use(cors());




app.use((req,res,next)=>{
  res.header('Cache-Control','no-cache,private,no-Store,must-revalidate,max-scale=0,post-check=0,pre-check=0');
  next();
});

//flash
app.use(flash());

//user route
app.use('/',userRoute);
app.use('/admin',adminRoute);

//error handlermiddleware
app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT;
app.listen(port || 8000,()=>{
    console.log(`Server listening to port ${port}`);
})