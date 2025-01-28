const express = require('express');
const ValidateToken = require('../middleware/validation');

const router = express.Router();

router.get('/', ValidateToken, async(req, res) => {
    console.log('Home route accessed');
    res.render('index',{ user: req.user });
})

module.exports = router;