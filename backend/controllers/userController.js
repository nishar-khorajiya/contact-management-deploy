const User = require('../models/User');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// Login user
// route POST /api/users/login
const loginUser = async (req, res) => {
  const { username, password,email } = req.body;

  try {
    const user = await User.findOne({ username });
    const user1 = await User.findOne({ email });

    if ((user || user1 )&& (await user.matchPassword(password)||await user1.matchPassword(password))) {
      res.json({
        _id: user._id,
        username: user.username,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Register user 
// POST /api/users/register
const registerUser = async (req, res) => {
  const { username, password ,email} = req.body;

  try {
    const userExists = await User.findOne({ username });
    const userExists1 = await User.findOne({ email });

    if (userExists||userExists1) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      username,
      email,
      password,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        username: user.username,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { loginUser, registerUser };
