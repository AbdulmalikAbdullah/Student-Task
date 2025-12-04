const mongoose = require("mongoose");

const Course = new mongoose.Schema({
    name: { type: String, required: true },
    courseCode: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Course', Course);