const Course = require("../models/Course");
const User = require("../models/User");
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
        res.json(courses);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('getMyCourses error');
    }
};

exports.getCourseById = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id).populate('members', 'displayName email');
        if (!course) return res.status(404).json({ msg: 'Course not found' });
        res.json(course);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('getCourseById error');
    }
};

