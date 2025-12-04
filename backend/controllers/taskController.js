const Task = require("../models/Task.js");
const Course = require("../models/Course.js");

exports.createTask = async (req, res) => {
    try {
        const { title, description, dueDate, priority, courseId, course } = req.body;
        const courseField = courseId || course;
        if (!courseField) {
            return res.status(400).json({ msg: 'course is required' });
        }
        const task = new Task({ title, description, dueDate, priority, course: courseField });
        await task.save();

        const io = req.app.locals.io;
        io.to(courseId).emit("taskCreated", task);

        res.json(task);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('createTask error');
    }
};

exports.getTasksByCourse = async (req, res) => {
    try {
        const tasks = await Task.find({ course: req.params.courseId }).sort({ order: 1 });
        res.json(tasks)
    } catch (err) {
        console.error(err.message);
        res.status(500).send('GetTasksByCourse error');
    }
};

exports.updateTask = async (req, res) => {
    try {
        const updates = req.body
        const task = await Task.findByIdAndUpdate(req.params.id, updates, { new: true });

        if (!task) {
            return res.status(404).json({ msg: 'Task not found' });
        }

        const io = req.app.locals.io;
        if (io && task.course) {
            io.to(task.course.toString()).emit("taskUpdated", task);
        }

        res.json(task);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('updateTask error');
    }
};

exports.deleteTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) {
            return res.status(404).json({ msg: 'Task not found' });
        }

        const io = req.app.locals.io;
        if (io && task.course) {
            io.to(task.course.toString()).emit("taskDeleted", { id: task._id });
        }

        res.json({ msg: 'Task deleted' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('deleteTask error');
    }
};

exports.reorderTasks = async (req, res) => {
    try {
        const { taskIds, courseId } = req.body;
        
        if (!taskIds || !Array.isArray(taskIds) || taskIds.length === 0) {
            return res.status(400).json({ msg: 'taskIds array is required' });
        }

        // Update order for each task
        const updatePromises = taskIds.map((taskId, index) =>
            Task.findByIdAndUpdate(taskId, { order: index }, { new: true })
        );

        const updatedTasks = await Promise.all(updatePromises);

        // Emit socket event to update all connected clients
        const io = req.app.locals.io;
        if (io && courseId) {
            io.to(courseId).emit("tasksReordered", updatedTasks);
        }

        res.json(updatedTasks);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('reorderTasks error');
    }
};

exports.getNotifications = async (req, res) => {
    try {
        const userId = req.user.id;
        
        // Get all tasks assigned to the current user, populated with course details
        const notifications = await Task.find({ assignedTo: userId })
            .populate('course', 'name')
            .sort({ dueDate: 1 })
            .lean();

        res.json(notifications);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('getNotifications error');
    }
};