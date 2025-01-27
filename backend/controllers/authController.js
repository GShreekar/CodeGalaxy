import { User } from '../models/index.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export const registerUser = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;

    if (!name || !username || !email || !password) {
      return res.status(400).json({
        message: 'Please provide all required fields: name, username, email, and password.'
      });
    }

    const userExists = await User.findOne({ 
      $or: [{ email }, { username }] 
    });

    if (userExists) {
      return res.status(400).json({ 
        message: 'A user with this email or username already exists. Please try a different email or username.'
      });
    }

    // Hash password before creating user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      username,
      email,
      password: hashedPassword
    });

    const token = jwt.sign(
      { id: user._id }, 
      process.env.JWT_SECRET, 
      { expiresIn: '30d' }
    );

    res.status(201).json({
      success: true,
      _id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(400).json({ 
      success: false,
      message: 'An error occurred while registering. Please try again later.'
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        message: 'Please provide both username and password.'
      });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({
        message: 'User not found.'
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        message: 'Incorrect password.'
      });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.json({
      success: true,
      _id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      token
    });
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      message: 'An error occurred while logging in. Please try again later.'
    });
  }
};