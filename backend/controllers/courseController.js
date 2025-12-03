const Course = require("../models/Course");
const Task = require("../models/Task");
const crypto = require("crypto");

exports.createCourse = async (req, res) => {
    try {
        const { name } = req.body;
        const code = crypto.randomBytes(3).toString('hex');
        const course = new Course({ name, code, members: [req.user.id] });
        await course.save();
        res.json(course);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("createCourse error");
    }
};

exports.joinCourse = async (req, res) => {
    try {
        const { code } = req.body;
        const course = await Course.findOne({ code });
        if (!course) return res.status(404).json({ msg: 'Course not found' });

        if (!course.members.includes(req.user.id)) {
            course.members.push(req.user.id);
            await course.save();
        }
        res.json(course);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('joinCourse error');
    }
};

exports.getMyCourses = async (req, res) => {
    try {
        const courses = await Course.find({ members: req.user.id });
        const coursesWithTasks = await Promise.all(
            courses.map(async (course) => {
                const taskCount = await Task.countDocuments({ course: course._id });
                return { ...course.toObject(), taskCount };
            })
        );
        res.json(coursesWithTasks);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('getMyCourses error');
    }
};

exports.getCourseById = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id).populate('members', 'firstName lastName email');
        if (!course) return res.status(404).json({ msg: 'Course not found' });
        res.json(course);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('getCourseById error');
    }
};

exports.updateCourseName = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name || !name.trim()) {
            return res.status(400).json({ msg: 'Course name is required' });
        }

        const course = await Course.findById(req.params.id);
        if (!course) return res.status(404).json({ msg: 'Course not found' });

        // Check if user is a member (convert to string for comparison)
        const userId = req.user.id.toString();
        const isMember = course.members.some(memberId => memberId.toString() === userId);
        
        if (!isMember) {
            return res.status(403).json({ msg: 'Not authorized to update this course' });
        }

        course.name = name.trim();
        await course.save();
        res.json(course);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('updateCourseName error');
    }
};

exports.deleteCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) return res.status(404).json({ msg: 'Course not found' });

        // Check if user is a member (convert to string for comparison)
        const userId = req.user.id.toString();
        const isMember = course.members.some(memberId => memberId.toString() === userId);
        
        if (!isMember) {
            return res.status(403).json({ msg: 'Not authorized to delete this course' });
        }

        // Delete all tasks associated with this course
        await Task.deleteMany({ course: req.params.id });

        // Delete the course
        await Course.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Course deleted successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('deleteCourse error');
    }
};

