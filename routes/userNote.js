const express = require('express');
const ValidateToken = require('../middleware/validation');

const router = express.Router();

router.get('/', ValidateToken, async(req, res) => {
    res.render('index',{ user: req.user });
});

router.post('/create', ValidateToken, async(req, res) => {
    try {
        const {Title, Content} = req.body;

        if(!Title || Content){
            return res.status(400).render('/',{Msg:"inputs are required"})
        }

        
    } catch (error) {
        
    }
});

module.exports = router;