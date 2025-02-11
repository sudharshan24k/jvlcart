const express = require('express');
const { registerUser } = require('../controllers/authController');
const { model } = require('mongoose');
const router = express.Router();

router.route('/register').post(registerUser)

model.exports = router;