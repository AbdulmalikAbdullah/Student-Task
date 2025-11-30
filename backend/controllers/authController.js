const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User.js");

require("dotenv").config();


exports.register = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    try {

        let user = await User.findOne({ email });
        if (user) return res.status(401).json({ msg: 'User already exists' });

        user = new User({ firstName, lastName, email, password });
        const hash = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, hash)
        await user.save();

        const payload = { user: { id: user.id } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' }, (err, token) => {
            if (err) throw err;
            res.json({ token, user: { id: user.id, firstName: user.firstName, lastName: user.lastName, email: user.email } });
        });

    } catch (err) {

        console.log(err.message)
        res.status(500).send('register error');
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

        const payload = { user: { id: user.id } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' }, (err, token) => {
            if (err) throw err;
            res.json({ token, user: { id: user.id, firstName: user.firstName, lastName: user.lastName, email: user.email } });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('login error');
    }
};

exports.me = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) return res.status(404).json({ msg: 'User not found' });
        res.json({ user: { id: user.id, firstName: user.firstName, lastName: user.lastName, email: user.email } });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('me error');
    }
};

exports.updateProfile = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ msg: 'User not found' });

        // Check if email is already taken by another user
        if (email && email !== user.email) {
            const existingUser = await User.findOne({ email });
            if (existingUser) return res.status(400).json({ msg: 'Email already in use' });
        }

        // Update user fields
        if (firstName) user.firstName = firstName;
        if (lastName) user.lastName = lastName;
        if (email) user.email = email;

        // Update password if provided
        if (password) {
            const hash = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, hash);
        }

        await user.save();

        res.json({ 
            msg: 'Profile updated successfully',
            user: { 
                id: user.id, 
                firstName: user.firstName, 
                lastName: user.lastName, 
                email: user.email 
            } 
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Error updating profile' });
    }
};
