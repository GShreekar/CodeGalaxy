import { User } from '../models/index.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export const registerUser = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;

    const userExists = await User.findOne({ 
      $or: [{ email }, { username }] 
    });

    if (userExists) {
      return res.status(400).json({ 
        message: 'User already exists' 
      });
    }

    const user = await User.create({
      name,
      username,
      email,
      password
    });

    const token = jwt.sign(
      { id: user._id }, 
      process.env.JWT_SECRET, 
      { expiresIn: '30d' }
    );

    res.status(201).json({
      _id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      token
    });
  } catch (error) {
    res.status(400).json({ 
      message: error.message 
    });
  }
};

export const loginUser = async (req, res) => {
    try {
      const { username, password } = req.body;
  
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
  
      const token = jwt.sign(
        { id: user._id }, 
        process.env.JWT_SECRET, 
        { expiresIn: '30d' }
      );
  
      res.json({
        _id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        token
      });
    } catch (error) {
      res.status(500).json({ 
        message: error.message 
      });
    }
  };