import { User } from '../models/index.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const TOKEN_EXPIRY = '7d';

const signToken = (user) =>
  jwt.sign(
    { id: user._id, tokenVersion: user.tokenVersion },
    process.env.JWT_SECRET,
    { expiresIn: TOKEN_EXPIRY }
  );

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

    // password is hashed by the User model's pre('save') hook
    const user = await User.create({
      name,
      username,
      email,
      password
    });

    res.status(201).json({
      success: true,
      _id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      token: signToken(user)
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
        message: 'Invalid credentials'
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        message: 'Invalid credentials'
      });
    }

    res.json({
      success: true,
      _id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      token: signToken(user)
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      message: 'An error occurred while logging in. Please try again later.'
    });
  }
};

export const logoutUser = async (req, res) => {
  try {
    req.user.tokenVersion += 1;
    await req.user.save();
    res.json({ message: 'Logged out' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      message: 'An error occurred while logging out. Please try again later.'
    });
  }
};