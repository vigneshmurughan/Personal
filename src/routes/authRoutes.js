const express = require('express');
const bcrypt = require('bcryptjs');

const User = require('../models/User');

const router = express.Router();

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password || password.length < 6) {
    return res.status(400).render('message', {
      title: 'Registration error',
      message: 'Please provide name, email and a password with at least 6 characters.',
      type: 'error'
    });
  }

  try {
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).render('message', {
        title: 'Registration error',
        message: 'An account with this email already exists.',
        type: 'error'
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      passwordHash
    });

    req.session.user = {
      id: user._id.toString(),
      name: user.name,
      email: user.email
    };

    return res.redirect('/dashboard');
  } catch (error) {
    return res.status(500).render('message', {
      title: 'Registration error',
      message: `Unable to register user: ${error.message}`,
      type: 'error'
    });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).render('message', {
      title: 'Login error',
      message: 'Email and password are required.',
      type: 'error'
    });
  }

  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).render('message', {
        title: 'Login error',
        message: 'Invalid email or password.',
        type: 'error'
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordCorrect) {
      return res.status(401).render('message', {
        title: 'Login error',
        message: 'Invalid email or password.',
        type: 'error'
      });
    }

    req.session.user = {
      id: user._id.toString(),
      name: user.name,
      email: user.email
    };

    return res.redirect('/dashboard');
  } catch (error) {
    return res.status(500).render('message', {
      title: 'Login error',
      message: `Unable to login user: ${error.message}`,
      type: 'error'
    });
  }
});

router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

module.exports = router;
