const mongoose = require("mongoose");

const User = new mongoose.Schema({
    displayName:{type:String, required:true},
    email:{type: String, required: true, unique: true},
    password:{type: String, required: true, unique: true},
    verified:{type: Boolean, default: false},
    createdAt:{type: Date, default: Date.now}
});

module.exports = mongoose.model("User", User);
