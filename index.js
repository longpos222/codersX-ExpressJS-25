const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
require('dotenv').config();

//---
//=>give the object after update was applied
mongoose.set('returnOriginal', false);
//----
mongoose.connect(process.env.MONGO_DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});
const db1 = mongoose.connection;
db1.on('error', console.error.bind(console, 'connection error:'));
db1.once('open', function() {
 console.log(`we\'re connected to dbs!`);
});

const indexRoute = require('./routers/index.route.js');
const bookRoute = require('./routers/book.route.js');
const transactionRoute = require('./routers/transaction.route.js');
const userRoute = require('./routers/user.route.js');
const authRoute = require('./routers/auth.route.js');
const cartRoute = require('./routers/cart.route.js');

const sessionMiddleware = require('./middlewares/session.middleware');
const authMiddleware = require('./middlewares/auth.middleware');

const app = express();
const port = 3000;

app.set('views','./views');
app.set('view engine','pug');

app.use(express.static('public'))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));
app.use(cookieParser("codersx"));
app.use(sessionMiddleware.create);
//app.use(cookieMiddleware.countCookie);

app.use('/', indexRoute);
app.use('/books', bookRoute);
app.use('/transactions', authMiddleware.authRequire, transactionRoute);
app.use('/users', authMiddleware.authRequire,  userRoute);
app.use('/auth', authRoute);
app.use('/cart', cartRoute);

app.listen(port,()=>console.log(`OK http://localhost:${port}`));