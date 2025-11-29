const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const { createCourse, joinCourse, getMyCourses, getCourseById } = require("../controllers/courseController")

router.post('/create', auth, createCourse);
router.post('/join', auth, joinCourse);
router.get('/my-courses', auth, getMyCourses);
router.get('/:id', auth, getCourseById);


module.exports = router;