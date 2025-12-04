const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const { createCourse, joinCourse, getMyCourses, getCourseById, updateCourseName, deleteCourse } = require("../controllers/courseController")


router.post('/create', auth, createCourse);
router.post('/join', auth, joinCourse);
router.get('/my-courses', auth, getMyCourses);
router.get('/:id', auth, getCourseById);
router.put('/:id', auth, updateCourseName);
router.delete('/:id', auth, deleteCourse);


module.exports = router;