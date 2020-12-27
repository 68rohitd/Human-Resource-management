const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
let auth = require("../middleware/auth");
let Admin = require("../models/admin.model");

// @desc: register a user
router.post("/register", async (req, res) => {
  try {
    let { email, password, passwordCheck, name } = req.body;

    // validation
    if (!email || !password || !passwordCheck) {
      return res.status(400).json({ msg: "Please enter all the fields" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ msg: "Password should be at least 6 characters" });
    }

    if (password !== passwordCheck) {
      return res
        .status(400)
        .json({ msg: "Please enter the same password twice" });
    }

    const existingUser = await Admin.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({
        msg: "The email address is already in use by another account.",
      });
    }

    if (!name) name = email;

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new Admin({
      email,
      password: passwordHash,
      name,
      role: "admin",
      leaveRequests: [],
      bonusRequests: [],
      loanRequests: [],
    });

    const savedUser = await newUser.save();
    res.json(savedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @desc: login a user
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // validate
    if (!email || !password)
      return res.status(400).json({ msg: "Please enter all the fields" });

    const user = await Admin.findOne({ email: email });
    if (!user)
      return res
        .status(400)
        .json({ msg: "No account with this email has been registered" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ msg: "Invalid username or password" });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({
      token,
      user,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
module.exports = router;
