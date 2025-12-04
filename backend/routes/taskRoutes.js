const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const { createTask, getTasksByCourse, updateTask, deleteTask, reorderTasks, getNotifications } = require('../controllers/taskController');

router.post('/create', auth, createTask);
router.get('/course/:courseId', auth, getTasksByCourse);
router.put('/:id', auth, updateTask);
router.delete('/:id', auth, deleteTask);
router.post('/reorder', auth, reorderTasks);
router.get('/notifications/user', auth, getNotifications);


module.exports = router;