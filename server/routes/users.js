const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
let auth = require("../middleware/auth");
let User = require("../models/user.model");
let Admin = require("../models/admin.model");

// @desc: register a user
// router.post("/register", async (req, res) => {
//   try {
//     let { email, password, passwordCheck, displayName } = req.body;

//     // validation
//     if (!email || !password || !passwordCheck) {
//       return res.status(400).json({ msg: "Please enter all the fields" });
//     }

//     if (password.length < 6) {
//       return res
//         .status(400)
//         .json({ msg: "Password should be at least 6 characters" });
//     }

//     if (password !== passwordCheck) {
//       return res
//         .status(400)
//         .json({ msg: "Please enter the same password twice" });
//     }

//     const existingUser = await User.findOne({ email: email });
//     if (existingUser) {
//       return res.status(400).json({
//         msg: "The email address is already in use by another account.",
//       });
//     }

//     if (!displayName) displayName = email;

//     const salt = await bcrypt.genSalt();
//     const passwordHash = await bcrypt.hash(password, salt);

//     const newUser = new User({
//       email,
//       password: passwordHash,
//       displayName,
//       notification: [],
//     });

//     const savedUser = await newUser.save();
//     res.json(savedUser);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// @desc: login a user
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // validate
    if (!email || !password)
      return res.status(400).json({ msg: "Please enter all the fields" });

    const user = await User.findOne({ email: email });
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

    const user = await User.findById(verified.id);
    if (!user) return res.json(false);

    return res.json(true);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

// @desc: get user details of logged in user
router.get("/", auth, async (req, res) => {
  const user = await User.findById(req.user);
  res.json({
    user,
  });
});

// @update user profile
router.route("/updateProfile").post((req, res) => {
  User.findByIdAndUpdate(
    req.body.id,
    {
      name: req.body.user.name,
      address: req.body.user.address,
      email: req.body.user.email,
      phoneNo: req.body.user.phoneNo,
      salary: req.body.user.salary,
      team: req.body.user.team,
      role: req.body.user.role,
      skills: req.body.user.skills,
      doj: req.body.user.doj,
      objective: req.body.user.objective,
    },
    { new: true },
    function (err, result) {
      if (err) {
        res.send(err);
      } else {
        res.send(result);
      }
    }
  );
});

// @desc: Apply for leave
router.put("/applyLeave", async (req, res) => {
  // 1. push to admin
  const admin = await Admin.findOne({ email: "admin@gmail.com" });
  let leaveRequests = admin.leaveRequests;
  leaveRequests.push(req.body.request);

  Admin.findOneAndUpdate(
    { email: "admin@gmail.com" },
    { leaveRequests: leaveRequests },
    function (err, result) {
      if (err) res.status(400).json("Error: ", err);
      else console.log("pushed request to admin...");
    }
  );

  // 2. push to user
  const user = await User.findOne({ email: req.body.request.empEmail });
  let notification = user.notification;
  notification.push(req.body.request);

  User.findOneAndUpdate(
    { email: req.body.request.empEmail },
    { notification: notification },
    function (err, result) {
      if (err) res.status(400).json("Error: ", err);
      else {
        console.log("pushed notification to user profile");
        res.json(result);
      }
    }
  );
});

// @desc: request for bonus
router.put("/bonusRequest", async (req, res) => {
  // 1. push to admin
  const admin = await Admin.findOne({ email: "admin@gmail.com" });
  let bonusRequests = admin.bonusRequests;
  bonusRequests.push(req.body.request);

  Admin.findOneAndUpdate(
    { email: "admin@gmail.com" },
    { bonusRequests: bonusRequests },
    function (err, result) {
      if (err) res.status(400).json("Error: ", err);
      else console.log("pushed request to admin...");
    }
  );

  // 2. push to user
  const user = await User.findOne({ email: req.body.request.empEmail });
  let notification = user.notification;
  notification.push(req.body.request);

  User.findOneAndUpdate(
    { email: req.body.request.empEmail },
    { notification: notification },
    function (err, result) {
      if (err) res.status(400).json("Error: ", err);
      else {
        console.log("pushed notification to user profile");
        res.json(result);
      }
    }
  );
});

// @desc: request for loan
router.put("/loanRequest", async (req, res) => {
  // 1. push to admin
  const admin = await Admin.findOne({ email: "admin@gmail.com" });
  let loanRequests = admin.loanRequests;
  loanRequests.push(req.body.request);

  Admin.findOneAndUpdate(
    { email: "admin@gmail.com" },
    { loanRequests: loanRequests },
    function (err, result) {
      if (err) res.status(400).json("Error: ", err);
      else console.log("pushed request to admin...");
    }
  );

  // 2. push to user
  const user = await User.findOne({ email: req.body.request.empEmail });
  let notification = user.notification;
  notification.push(req.body.request);

  User.findOneAndUpdate(
    { email: req.body.request.empEmail },
    { notification: notification },
    function (err, result) {
      if (err) res.status(400).json("Error: ", err);
      else {
        console.log("pushed notification to user profile");
        res.json(result);
      }
    }
  );
});

module.exports = router;
