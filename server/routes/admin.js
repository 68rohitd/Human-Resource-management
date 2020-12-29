const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
let auth = require("../middleware/auth");
let Admin = require("../models/admin.model");
let User = require("../models/user.model");

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

// @desc: add employee by admin
router.post("/addEmployee", async (req, res) => {
  try {
    let { email, name, address, phoneNo, role, salary, team, doj } = req.body;

    // validation
    if (
      !email ||
      !name ||
      !address ||
      !phoneNo ||
      !role ||
      !salary ||
      !team ||
      !doj
    ) {
      return res.status(400).json({ msg: "Please enter all the fields" });
    }

    // generating password
    const password = "password";

    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({
        msg: "The email address is already in use by another account.",
      });
    }

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
      email,
      password: passwordHash,
      name,
      team,
      phoneNo,
      salary,
      address,
      role,
      doj,
      notification: [],
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

// @desc: verify a user against token
router.post("/tokenIsValid", async (req, res) => {
  try {
    const token = req.header("x-auth-token");
    if (!token) return res.json(false);

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    if (!verified) return res.json(false);

    const user = await Admin.findById(verified.id);
    if (!user) return res.json(false);

    return res.json(true);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

// @desc: get user details of logged in user
router.get("/", auth, async (req, res) => {
  const user = await Admin.findById(req.user);
  res.json({
    user,
  });
});

// @desc: approve/reject requests
router.put("/takeAction", async (req, res) => {
  const user = await User.findOne({ _id: req.body.userReq.empId });
  let updatedNotificationList = [];
  user.notification.forEach((notification) => {
    if (notification.reqId === req.body.userReq.reqId) {
      if (req.body.userReq.approved) {
        //if approved by admin
        notification.approved = true;
        notification.ticketClosed = true;
      } else {
        //if not approved by admin
        notification.approved = false;
        notification.ticketClosed = true;
      }
      updatedNotificationList.push(notification);
    } else {
      updatedNotificationList.push(notification);
    }
  });

  User.findOneAndUpdate(
    { _id: req.body.userReq.empId },
    { notification: updatedNotificationList },
    { new: true },
    function (err, result) {
      if (err) res.status(400).json("Error: ", err);
    }
  );

  const admin = await Admin.findOne({ email: "admin@gmail.com" });

  if (req.body.userReq.title === "leave request") {
    // leave requests
    let updatedLeaveReq = [];

    admin.leaveRequests.forEach((request) => {
      if (request.reqId !== req.body.userReq.reqId)
        updatedLeaveReq.push(request);
    });

    Admin.findOneAndUpdate(
      { email: "admin@gmail.com" },
      { leaveRequests: updatedLeaveReq },
      { new: true },
      function (err, result) {
        if (err) res.status(400).json("Error: ", err);
        else res.json(result);
      }
    );
  } else if (req.body.userReq.title === "bonus request") {
    // bonus requests
    let updatedBonusReq = [];

    admin.bonusRequests.forEach((request) => {
      if (request.reqId !== req.body.userReq.reqId)
        updatedBonusReq.push(request);
    });

    Admin.findOneAndUpdate(
      { email: "admin@gmail.com" },
      { bonusRequests: updatedBonusReq },
      { new: true },
      function (err, result) {
        if (err) res.status(400).json("Error: ", err);
        else res.json(result);
      }
    );
  } else {
    // loan requests
    let updatedLoanReq = [];

    admin.loanRequests.forEach((request) => {
      if (request.reqId !== req.body.userReq.reqId)
        updatedLoanReq.push(request);
    });

    Admin.findOneAndUpdate(
      { email: "admin@gmail.com" },
      { loanRequests: updatedLoanReq },
      { new: true },
      function (err, result) {
        if (err) res.status(400).json("Error: ", err);
        else res.json(result);
      }
    );
  }
});

module.exports = router;
