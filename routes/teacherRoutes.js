const router = require('express').Router();
const teacher = require('../controller/teacherController');
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })


router.post('/signup', teacher.signUp);
router.post('/login', teacher.login);
router.post('/add-new-course', upload.single('thumbnail'), teacher.addNewCourse);
router.post('/course-data', teacher.coursesData);

module.exports = router