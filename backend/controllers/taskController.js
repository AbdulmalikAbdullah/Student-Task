const Task = require("../models/Task.js");
const Course = require("../models/Course.js");

exports.createTask = async (req, res) => {
    try {
        const { title, description, dueDate, priority, courseId, course } = req.body;
        // Accept either `courseId` or `course` in the request body (frontend may send either).
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
        const tasks = await Task.find({ course: req.params.courseId })
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