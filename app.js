const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const connection = require('./config/dbCon');


const app = express();
const port = process.env.PORT || 3001

//database connection
connection();


////////////middleware//////////
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.static('public'));

////view engine//////////////////
app.set('view engine', 'ejs');


/////////////routes/////////////////
app.use('/auth', require('./routes/auth/register'));
app.use('/verif', require('./routes/auth/forgetPwd'));
app.use('/home', require('./routes/userNote'));


app.listen(port, () => console.log(`app listening on port ${port}!`))