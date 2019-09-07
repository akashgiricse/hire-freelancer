const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const User = require('../../models/User');

// @route  GET api/users
// @desc   Register user
// @access Public
router.post(
  '/',
  [
    check('name', 'Name is required')
      .not()
      .isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      // check if user already exist
      let user = await User.findOne({
        email: email
      });

      if (user) {
        res
          .status(400)
          .json({ errors: [{ msg: 'This email is already registered' }] });
      }

      const avatar = gravatar.url(email, {
        s: '200',
        r: 'pg',
        d: 'mm'
      });

      // encrypt password
      const salt = await bcrypt.genSalt(10);

      let hashedPassword = await bcrypt.hash(password, salt);

      user = new User({
        name: name,
        email: email,
        avatar: avatar,
        password: hashedPassword
      });

      await user.save();

      res.status(200).send('User registered');
    } catch (err) {
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;
