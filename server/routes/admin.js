const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
let auth = require("../middleware/auth");
let Admin = require("../models/admin.model");
let User = require("../models/user.model");
let Salary = require("../models/salary.model");
let SalaryReceipt = require("../models/salaryReceipt.model");
const { json } = require("express");

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
    let { email, name, address, phoneNo, role, team, doj, gender } = req.body;

    // validation
    if (
      !email ||
      !name ||
      !address ||
      !phoneNo ||
      !role ||
      !team ||
      !doj ||
      !gender
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
      gender,
      team,
      phoneNo,
      address,
      role,
      doj,
      notification: [],
    });

    const savedUser = await newUser.save();

    // create entry in salary model
    const newSalaryDetails = new Salary({
      empId: savedUser._id,
      empName: name,
      basicPay: 0,
      totalLeaves: 0,
      travelAllowance: 0,
      medicalAllowance: 0,
      salary: 0,
    });

    await newSalaryDetails.save();

    // create entry in SALARYRECEIPT MODEL
    const newSalaryReceipt = new SalaryReceipt({
      empId: savedUser._id,
      empName: name,
      currentSalary: 0,
      monthlyReceipts: [],
    });

    await newSalaryReceipt.save();

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
  let reqApproved = false;

  const user = await User.findOne({ _id: req.body.userReq.empId });
  let updatedNotificationList = [];
  user.notification.forEach((notification) => {
    if (notification.reqId === req.body.userReq.reqId) {
      if (req.body.userReq.approved) {
        //if approved by admin
        reqApproved = true;
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

    // update emp's SALARY MODEL : increament leaveCount
    const salDetail = await Salary.findOne({ empId: req.body.userReq.empId });
    let currentLeaves = parseInt(salDetail.totalLeaves);
    currentLeaves += 1;

    let updatedSalDetails = await Salary.findOneAndUpdate(
      { empId: req.body.userReq.empId },
      { totalLeaves: currentLeaves },
      { new: true }
    );
    console.log("updated total leaves : ", updatedSalDetails);
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

// @desc: get list of all emp
router.get("/getEmpList", async (req, res) => {
  const empList = await User.find({});
  res.send(empList);
});

// ************* SALARY PART: START **********************
// @desc: get list of emp's sal receipts
router.get("/getAllEmpsSalReceipt", async (req, res) => {
  const AllEmpsSalReceipt = await SalaryReceipt.find({});
  res.send(AllEmpsSalReceipt);
});

// @desc: get particular emp's sal receipt details
router.get("/getSingleEmpSalReceipts/:id", async (req, res) => {
  try {
    const singleEmpSalReceipts = await SalaryReceipt.findOne({
      empId: req.params.id,
    });
    res.json(singleEmpSalReceipts);
  } catch (err) {
    res.status(500).json(err);
  }
});

// @desc: generate emp sal receipt for particular month
router.put("/generateSalReceipt", async (req, res) => {
  try {
    const empReceiptDoc = await SalaryReceipt.findOne({
      empId: req.body.empId,
    });

    let monthlyReceipts = empReceiptDoc.monthlyReceipts;
    monthlyReceipts.push({
      month: req.body.month,
      year: req.body.year,
      salDetails: req.body.salDetails,
    });

    const updatedEmpReceiptDoc = await SalaryReceipt.findOneAndUpdate(
      { empId: req.body.empId },
      {
        monthlyReceipts: monthlyReceipts,
      },
      { new: true }
    );
    res.json(updatedEmpReceiptDoc);
  } catch (e) {
    res.status(500).json({ err: e });
  }
});

// @desc: get list of emp's salary details
router.get("/getEmpSalList", async (req, res) => {
  try {
    const empSalList = await Salary.find({});
    res.json(empSalList);
  } catch (err) {
    res.status(500).json(err);
  }
});

// @desc: get a particular users salary details
router.get("/getUserSalDetails/:id", async (req, res) => {
  try {
    const userSalDetails = await Salary.findOne({ empId: req.params.id });
    res.json(userSalDetails);
  } catch (err) {
    res.status(500).json(err);
  }
});

// @desc: update user salary details
router.put("/updateSalaryDetails/:id", async (req, res) => {
  try {
    const salDetails = req.body.salDetails;
    const salDoc = await Salary.findOneAndUpdate(
      { empId: req.params.id },
      {
        basicPay: salDetails.basicPay,
        totalLeaves: salDetails.totalLeaves,
        travelAllowance: salDetails.travelAllowance,
        medicalAllowance: salDetails.medicalAllowance,
        salary: salDetails.salary,
      },
      { new: true }
    );

    // update corresponding SALARYRECEIPT MODEL's current salary:
    const salReceipt = await SalaryReceipt.findOneAndUpdate(
      { empId: req.params.id },
      {
        currentSalary: salDoc.salary,
      }
    );

    res.json(salDoc);
  } catch (e) {
    res.status(500).json({ err: err.message });
  }
});
// ************* SALARY PART: END **********************

// @desc: delete a user account
router.delete("/delete/:id", async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    // delete corresponding SALARY DETAILS too
    const deletedSalDetails = await Salary.findOneAndDelete({
      empId: req.params.id,
    });

    // delete corresponding SALARYRECEIPT DETAILS too
    const deletedSalReceipt = await SalaryReceipt.findOneAndDelete({
      empId: req.params.id,
    });

    res.json(deletedUser);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

// @desc: get a particular users data
router.get("/getUserData/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

// @desc: search component
router.post("/search", async (req, res) => {
  let name = req.body.name;
  let role = req.body.role;
  let team = req.body.team;
  let email = req.body.email;
  let doj = req.body.doj;
  // let startDoj = req.body.startDoj;
  // let endDoj = req.body.endDoj;

  // console.log(name, role, team, email, doj);

  // if fields are empty, match everything
  if (name === "") name = new RegExp(/.+/s);
  if (role === "") role = new RegExp(/.+/s);
  if (team === "") team = new RegExp(/.+/s);
  if (email === "") email = new RegExp(/.+/s);
  if (doj === "") doj = new RegExp(/.+/s);
  // if (startDoj === "") startDoj = new RegExp(/.+/s);
  // if (endDoj === "") endDoj = new RegExp(/.+/s);

  // console.log(l, s, i, d);

  User.find({
    name: new RegExp(name),
    role: new RegExp(role),
    team: new RegExp(team),
    email: new RegExp(email),
    doj: new RegExp(doj),
  })
    .then((emp) => {
      res.json(emp);
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

module.exports = router;
