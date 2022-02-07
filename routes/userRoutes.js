const router = require('express').Router();
const user = require('../controller/userController')

router.get('/',user.landingPage);
router.post('/signup',user.signUp);
router.post('/login',user.logIn);

module.exports = router