const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const { createTask, getTasksByCourse, updateTask, deleteTask } = require('../controllers/taskController');

router.post('/create', auth, createTask);
router.get('/course/:courseId', auth, getTasksByCourse);
router.put('/:id', auth, updateTask);
router.delete('/:id', auth, deleteTask);


module.exports = router;