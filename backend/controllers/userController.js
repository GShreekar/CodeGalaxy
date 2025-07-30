import { User } from '../models/index.js';


export const createUser = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;
    const user = await User.create({
      name,
      username,
      email,
      password
    });
    res.status(201).json({
      id: user._id,
      name: user.name,
      username: user.username,
      email: user.email
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getUserDetails = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password')
      .populate('usersnippets');
    res.json(user);
  } catch (error) {
    res.status(404).json({ message: 'User not found' });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = name || user.name;
      user.email = email || user.email;
      
      const updatedUser = await user.save();
      res.json({
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(401).json({ message: 'User not found' });
  }
};