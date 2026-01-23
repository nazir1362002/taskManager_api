const express = require('express');
const User = require('../models/User');
const router = express.Router();
const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');

router.get('/',(req,res) => {
    res.send('User routes are Working!!')
});
//For register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const user = await User.create({
      name,
      email,
      password // plain password ONLY
    });

    res.status(201).json({
      message: "User registered successfully"
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});
//Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) throw new Error("Unable to login: User not found");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Incorrect password");
    console.log("JWT SECRET:", process.env.JWT_SECRET_KEY);


    const token = JWT.sign({ _id: user._id.toString() }, process.env.JWT_SECRET_KEY, { expiresIn: "1h" });

    res.status(200).send({
      message: "Logged in successfully",
      user: { name: user.name, email: user.email },
      token
    });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});


module.exports = router;