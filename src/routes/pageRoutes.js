const express = require('express');

const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/', (req, res) => {
  if (req.session.user) {
    return res.redirect('/dashboard');
  }

  return res.redirect('/login');
});

router.get('/login', (req, res) => {
  if (req.session.user) {
    return res.redirect('/dashboard');
  }

  return res.render('login');
});

router.get('/register', (req, res) => {
  if (req.session.user) {
    return res.redirect('/dashboard');
  }

  return res.render('register');
});

router.get('/dashboard', requireAuth, (req, res) => {
  return res.render('dashboard', {
    user: req.session.user
  });
});

module.exports = router;
