const router = require('express').Router();

router.use('/', require('./register'));
router.use('/', require('./login'));
router.use('/', require('./forgetPwd'));

module.exports = router;