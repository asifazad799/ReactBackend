const router = require('express').Router();
const admin = require('../controller/adminController')

router.post('/login',admin.logIn);
router.get('/get-teacher-applications',admin.getTeachersData);
router.post('/approve-app',admin.approveApplication)
router.post('/reject-app',admin.rejectApplication)



module.exports = router