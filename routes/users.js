const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
let auth = require("../middleware/auth");
let User = require("../models/user.model");
let Admin = require("../models/admin.model");
const axios = require("axios").default;
const multer = require("multer");
const path = require("path");

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
  console.log(req.body.user);
  User.findByIdAndUpdate(
    req.body.id,
    {
      name: req.body.user.name,
      address: req.body.user.address,
      email: req.body.user.email,
      gender: req.body.user.gender,
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
  // to get admin email id
  const admin = await Admin.find({});

  // 1. push to admin
  // const admin = await Admin.findOne({ email: "admin@gmail.com" });

  let leaveRequests = admin[0].leaveRequests;
  leaveRequests.push(req.body.request);

  Admin.findOneAndUpdate(
    { email: admin[0].email },
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
  // to get admin email id
  const admin = await Admin.find({});

  // 1. push to admin
  // const admin = await Admin.findOne({ email: "admin@gmail.com" });

  let bonusRequests = admin[0].bonusRequests;
  bonusRequests.push(req.body.request);

  Admin.findOneAndUpdate(
    { email: admin[0].email },
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
  // to get admin email id
  const admin = await Admin.find({});

  // 1. push to admin
  // const admin = await Admin.findOne({ email: "admin@gmail.com" });

  let loanRequests = admin[0].loanRequests;
  loanRequests.push(req.body.request);

  Admin.findOneAndUpdate(
    { email: admin[0].email },
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

// @desc: change emp password
router.put("/changePassword/:id", async (req, res) => {
  try {
    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.newPassword;

    const user = await User.findById(req.params.id);

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch)
      return res
        .status(400)
        .json({ msg: "old password dont match with our database" });

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(newPassword, salt);

    const updatedUser = await User.findByIdAndUpdate(req.params.id, {
      password: passwordHash,
    });

    res.json(updatedUser);
  } catch (e) {
    res.status(400).json("Error: ", e);
  }
});

// @desc: get particular req details from USER.notification model
router.get("/getSingleReqDetails/:userId/:reqId", async (req, res) => {
  const user = await User.findById(req.params.userId);
  const reqDetails = user.notification.filter(
    (request) => request.reqId === req.params.reqId
  );

  res.json(reqDetails);
});

// @desc: get news from news api
router.get("/getNews", async (req, res) => {
  const api_key = process.env.REACT_APP_NEWS_API;
  try {
    await axios
      .get(
        `https://gnewsapi.net/api/search?q=technology&country=in&language=en&api_token=${api_key}`
      )
      .then((resp) => {
        res.json(resp.data);
      });
  } catch (e) {
    console.log(e);
  }
});

// @desc: get alerts if any
router.get("/getAlerts/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.json(user.alert);
  } catch (e) {
    res.status(400).json("Error: ", e);
  }
});

// @desc: delete a particular alert
router.put("/deleteAlert", async (req, res) => {
  try {
    const user = await User.findById(req.body.id);
    let alert = user.alert;
    alert = alert.filter((item) => item.reqId !== req.body.reqId);

    const updatedUser = await User.findByIdAndUpdate(
      req.body.id,
      {
        alert,
      },
      { new: true }
    );

    res.json(updatedUser);
  } catch (e) {
    res.status(400).json("Error: ", e);
  }
});

// multer file
// @desc: file upload
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});
var upload = multer({
  storage: storage,
});

router.post("/uploadfile", upload.single("file"), (req, res, next) => {
  const file = req.file;
  if (!file) {
    const error = new Error("Please uplad a file");
    error.httpStatusCode = 400;
    return next();
  }
  console.log(file);
  res.send(file);
});

// @desc: file download (attachment)
router.post("/download/:attachmentName", function (req, res, next) {
  const attachmentName = req.params.attachmentName;
  console.log(attachmentName);

  var filePath = `public/${attachmentName}`; // Or format the path using the `id` rest param
  var fileName = `attachmentName`; // The default name the browser will use

  res.download(filePath, fileName);
  // return next();
});
module.exports = router;
