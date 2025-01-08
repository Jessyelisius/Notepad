const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');
const morgan = require('morgan');

const app = express();
const port = process.env.PORT || 3001

////////////middleware//////////
app.use(cors())
app.use(morgan('dev'))
// app.use('view engine', 'ejs')

app.get('/', (req, res) => {
    res.send('hello world')
})

app.listen(port, () => console.log(`app listening on port ${port}!`))