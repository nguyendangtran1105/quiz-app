const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body } = require('express-validator');
const User = require('../models/User');
const { validate, verifyUser } = require('../middleware/auth');

const makeToken = (user) =>
  jwt.sign({ _id: user._id, username: user.username, admin: user.admin }, process.env.JWT_SECRET, {
    expiresIn: '1d',
  });

const credentialRules = [
  body('username').trim().notEmpty().withMessage('Username is required'),
  body('password').isLength({ min: 3 }).withMessage('Password must be at least 3 characters'),
];

// POST /api/auth/signup  (tài khoản mới luôn là user thường)
router.post('/signup', credentialRules, validate, async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (await User.findOne({ username })) {
      return res.status(409).json({ message: 'Username already exists' });
    }
    const user = await User.create({ username, password: await bcrypt.hash(password, 10) });
    res.status(201).json({ token: makeToken(user), user: { _id: user._id, username: user.username, admin: user.admin } });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/login
router.post('/login', credentialRules, validate, async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }
    res.json({ token: makeToken(user), user: { _id: user._id, username: user.username, admin: user.admin } });
  } catch (err) {
    next(err);
  }
});

// GET /api/auth/me  (kiểm tra token còn hạn)
router.get('/me', verifyUser, (req, res) => res.json({ user: req.user }));

module.exports = router;
