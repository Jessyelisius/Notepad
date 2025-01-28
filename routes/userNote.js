const express = require('express');
const ValidateToken = require('../middleware/validation');

const router = express.Router();

router.get('/', ValidateToken, async(req, res) => {
    res.render('index');
})

module.exports = router;