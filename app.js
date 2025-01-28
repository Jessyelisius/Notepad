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
app.use('/auth', require('./routes/auth/auth.routes'));
app.use('/home', require('./routes/userNote'));

// 404 page
app.use((req, res) => {
    console.error(`404 Error: Route not found - ${req.originalUrl}`);
    res.status(404).render('404', { Msg: 'The requested page was not found.' });
});

//400page
// app.use((err, req, res, next) => {
//     console.error(err.stack);
//     res.status(500).render('500', { error: err.message });
// });

app.listen(port, () => console.log(`app listening on port ${port}!`))