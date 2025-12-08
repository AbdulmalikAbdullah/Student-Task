const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User.js");

require("dotenv").config();

const crypto = require("crypto");
const nodemailer = require("nodemailer");

const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);


exports.register = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) return res.status(401).json({ msg: 'User already exists' });

        const hash = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, hash);
        const verificationToken = crypto.randomBytes(32).toString("hex");

        user = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            verificationToken
        });

        await user.save();

        const verificationUrl = `${process.env.CLIENT_URL}/verify-email?token=${verificationToken}&email=${email}`;

        await resend.emails.send({
            from: "Student Task <noreply@studenttask.online>",
            to: email,
            subject: "Verify your email",
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2>Email Verification</h2>
                    <p>Hi ${firstName},</p>
                    <p>Click the link below to verify your email:</p>
                    <a href="${verificationUrl}" style="display: inline-block; padding: 10px 20px; background: #007bff; color: white; text-decoration: none; border-radius: 5px;">Verify Email</a>
                    <p>Or copy: ${verificationUrl}</p>
                </div>
            `
        });

        res.status(201).json({ msg: "Registration successful. Please check your email to verify your account." });

    } catch (err) {
        console.error("Email error:", err);
        res.status(500).send('register error');
    }
};


exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: 'Invalid credentials' });
        if (!user.verified) return res.status(400).json({ msg: 'Please verify your email first' });
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

        if (email && email !== user.email) {
            const existingUser = await User.findOne({ email });
            if (existingUser) return res.status(400).json({ msg: 'Email already in use' });
        }

        if (firstName) user.firstName = firstName;
        if (lastName) user.lastName = lastName;
        if (email) user.email = email;

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

exports.verifyEmail = async (req, res) => {
    const { token, email } = req.query;

    try {
        const user = await User.findOne({ email, verificationToken: token });
        if (!user) return res.redirect(`${process.env.CLIENT_URL}/verify-email?status=error`);

        user.verified = true;
        user.verificationToken = undefined;
        await user.save();

        res.redirect(`${process.env.CLIENT_URL}/verify-email?status=success`);
    } catch (err) {
        console.error(err.message);
        res.redirect(`${process.env.CLIENT_URL}/verify-email?status=error`);
    }
};


exports.forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ msg: 'User not found' });

        const resetToken = crypto.randomBytes(32).toString("hex");
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 3600000;
        await user.save();

        const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}&email=${email}`;

        await resend.emails.send({
            from: "Student Task <noreply@studenttask.online>",
            to: email,
            subject: "Reset Your Password",
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2>Password Reset Request</h2>
                    <p>Hi ${user.firstName || 'there'},</p>
                    <p>You requested to reset your password. Click the button below to proceed:</p>
                    
                    <a href="${resetUrl}" 
                       style="display: inline-block; padding: 12px 24px; background-color: #007bff; 
                              color: white; text-decoration: none; border-radius: 5px; margin: 15px 0;">
                        Reset Password
                    </a>
                    
                    <p>Or copy and paste this link in your browser:</p>
                    <p style="background-color: #f8f9fa; padding: 10px; border-radius: 5px; 
                              word-break: break-all; font-family: monospace;">
                        ${resetUrl}
                    </p>
                    
                    <p><strong>This link will expire in 1 hour.</strong></p>
                    
                    <p>If you didn't request this, please ignore this email. Your password will remain unchanged.</p>
                    
                    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                    <p style="color: #666; font-size: 12px;">
                        For security reasons, this link can only be used once.
                    </p>
                </div>
            `,
            text: `Reset your password by clicking: ${resetUrl}\n\nThis link expires in 1 hour.`
        });

        res.json({ msg: "Password reset link sent to your email" });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('forgot password error');
    }
};



exports.resetPassword = async (req, res) => {
    const { token, email, newPassword } = req.body;

    try {
        const user = await User.findOne({
            email,
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) return res.status(400).json({ msg: 'Invalid or expired token' });

        const hash = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, hash);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.json({ msg: "Password reset successfully" });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('reset password error');
    }
};
