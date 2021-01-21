const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
let auth = require("../middleware/auth");
let Admin = require("../models/admin.model");
let User = require("../models/user.model");
let Salary = require("../models/salary.model");
let SalaryReceipt = require("../models/salaryReceipt.model");
const { json } = require("express");
const TeamAndRole = require("../models/teams.and.roles.model");
const Loan = require("../models/loan.model");

// @desc: register a user
router.post("/register", async (req, res) => {
  try {
    // check if already one admin is present or not
    const admin = await Admin.countDocuments();

    if (admin)
      return res
        .status(400)
        .json({ msg: "There can be only one admin at max" });

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
      gender === "Select Value"
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
      alert: [],
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
      bonus: 0,
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

// @desc: approve/reject requests
router.put("/takeAction", async (req, res) => {
  const user = await User.findOne({ _id: req.body.userReq.empId });
  if (!user) return res.status(400).json({ msg: "user not found" });

  // console.log("req: ", req.body.userReq);

  let isApproved = false;

  // update emp's notification list: status from PENDING --> Approved/Rejected
  let updatedNotificationList = [];
  user.notification.forEach((notification) => {
    if (notification.reqId === req.body.userReq.reqId) {
      if (req.body.userReq.approved) {
        //if approved by admin
        isApproved = true;
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

  // since approved/rejected send a notification to user in ALERT's ARRAY
  let alert = user.alert;
  let newAlert = {
    reqId: req.body.userReq.reqId,
    subject:
      req.body.userReq.subject ||
      req.body.userReq.loanReason ||
      req.body.userReq.bonusReason,
    reason:
      req.body.userReq.reason ||
      req.body.userReq.loanNote ||
      req.body.userReq.bonusNote,
    createdOn: req.body.userReq.date,
    approved: req.body.userReq.approved,
  };
  alert.push(newAlert);

  User.findOneAndUpdate(
    { _id: req.body.userReq.empId },
    { notification: updatedNotificationList, alert: alert },
    { new: true },
    function (err, result) {
      if (err) res.status(400).json("Error: ", err);
    }
  );

  // remove that particular req from admins req tab
  const admin = await Admin.findById(req.body.adminId);

  if (req.body.userReq.title === "leave request") {
    // leave requests
    let updatedLeaveReq = [];

    admin.leaveRequests.forEach((request) => {
      if (request.reqId !== req.body.userReq.reqId)
        updatedLeaveReq.push(request);
    });

    Admin.findByIdAndUpdate(
      req.body.adminId,
      { leaveRequests: updatedLeaveReq },
      { new: true },
      function (err, result) {
        if (err) res.status(400).json("Error: ", err);
        else res.json(result);
      }
    );

    // if approved: update emp's SALARY MODEL : increament leaveCount by no of leaves taken
    // cal date difference
    if (isApproved) {
      const dateOne = new Date(req.body.userReq.fromDate);
      const dateTwo = new Date(req.body.userReq.toDate);
      const differenceInTime = dateTwo.getTime() - dateOne.getTime();
      const differenceInDays = differenceInTime / (1000 * 3600 * 24) + 1;

      const salDetail = await Salary.findOne({ empId: req.body.userReq.empId });
      let currentLeaves = parseInt(salDetail.totalLeaves);
      currentLeaves += differenceInDays;

      await Salary.findOneAndUpdate(
        { empId: req.body.userReq.empId },
        { totalLeaves: currentLeaves },
        { new: true }
      );
    }
  } else if (req.body.userReq.title === "bonus request") {
    // bonus requests
    let updatedBonusReq = [];

    // remove that particular req from admin's notification
    admin.bonusRequests.forEach((request) => {
      if (request.reqId !== req.body.userReq.reqId)
        updatedBonusReq.push(request);
    });

    Admin.findByIdAndUpdate(
      req.body.adminId,
      { bonusRequests: updatedBonusReq },
      { new: true },
      function (err, result) {
        if (err) res.status(400).json("Error: ", err);
        else res.json(result);
      }
    );
  } else {
    try {
      // loan requests
      // remove that particular req from admin's notification
      let updatedLoanReq = [];

      admin.loanRequests.forEach((request) => {
        if (request.reqId !== req.body.userReq.reqId)
          updatedLoanReq.push(request);
      });

      Admin.findByIdAndUpdate(
        req.body.adminId,
        { loanRequests: updatedLoanReq },
        { new: true },
        function (err, result) {
          if (err) res.status(400).json("Error: ", err);
        }
      );

      // add loan details to LOAN MODEL only if approved
      if (isApproved) {
        const newLoan = new Loan({
          reqId: req.body.userReq.reqId,
          empId: req.body.userReq.empId,
          date: req.body.userReq.date,
          empName: req.body.userReq.empName,
          gender: req.body.userReq.gender,
          empRole: req.body.userReq.empRole,
          empTeam: req.body.userReq.empTeam,
          empEmail: req.body.userReq.empEmail,
          loanNote: req.body.userReq.loanNote,
          loanReason: req.body.userReq.loanReason,
          modeOfRepayment: req.body.userReq.modeOfRepayment,
          timePeriod: req.body.userReq.timePeriod,
          amount: req.body.userReq.amount,
          loanRepaid: false,
        });

        const savedLoan = await newLoan.save();
        res.json(savedLoan);
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
});

// @desc: get list of all emp
router.get("/getEmpList", async (req, res) => {
  const empList = await User.find({});
  res.send(empList);
});

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

    // delete corresponding LOAN DETAILS too
    await Loan.deleteMany({ empId: req.params.id });

    // delete req's if sent by this user
    const admin = await Admin.findById(req.body.adminId);

    const empId = req.params.id;

    let updatedLeaveRequests = [];
    let updatedBonusRequests = [];
    let updatedLoanRequests = [];

    updatedLeaveRequests = admin.leaveRequests.filter(
      (req) => req.empId !== empId
    );

    updatedBonusRequests = admin.bonusRequests.filter(
      (req) => req.empId !== empId
    );

    updatedLoanRequests = admin.loanRequests.filter(
      (req) => req.empId !== empId
    );

    await Admin.findOneAndUpdate(
      {},
      {
        leaveRequests: updatedLeaveRequests,
        bonusRequests: updatedBonusRequests,
        loanRequests: updatedLoanRequests,
      }
    );

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

  console.log(name, role, team, email, doj);

  // if fields are empty, match everything
  if (name === "") name = new RegExp(/.+/s);
  if (role === "") role = new RegExp(/.+/s);
  if (team === "") team = new RegExp(/.+/s);
  if (email === "") email = new RegExp(/.+/s);
  if (doj === "") doj = new RegExp(/.+/s);

  // console.log(l, s, i, d);

  User.find({
    name: new RegExp(name, "i"),
    role: new RegExp(role, "i"),
    team: new RegExp(team, "i"),
    email: new RegExp(email, "i"),
    doj: new RegExp(doj, "i"),
  })
    .then((emp) => {
      res.json(emp);
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

// ************************** SALARY PART: START ***********************************
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
    // update emp SALARY profile: clear bonus, total leaves
    await Salary.findOneAndUpdate(
      { empId: req.body.empId },
      { bonus: 0, totalLeaves: 0 }
    );

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
    res.json({ updatedEmpReceiptDoc, monthlyReceipts });
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
        bonus: salDetails.bonus,
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
// ************************** SALARY PART: END ***********************************

// ********************** OPTIONS PANEL APIS BEGIN *******************************
// @desc: get team list (adding a new team)
router.get("/getTeamsAndRoles", async (req, res) => {
  const teamsAndRoles = await TeamAndRole.find({});
  res.json(teamsAndRoles);
});

// @desc: add new team
router.post("/addNewTeam", async (req, res) => {
  const teamName = req.body.teamName;
  const teamObj = await TeamAndRole.find({});

  let teamList = teamObj[0].teamNames;

  teamList.push(teamName);

  const updatedTeamObj = await TeamAndRole.findOneAndUpdate(
    {},
    {
      teamNames: teamList,
    },
    { new: true }
  );

  res.json(updatedTeamObj);
});

// @desc: add new team
router.post("/addNewRole", async (req, res) => {
  const roleName = req.body.roleName;
  const teamObj = await TeamAndRole.find({});

  let roleList = teamObj[0].roleNames;
  roleList.push(roleName);

  const updatedTeamObj = await TeamAndRole.findOneAndUpdate(
    {},
    {
      roleNames: roleList,
    },
    { new: true }
  );

  res.json(updatedTeamObj);
});

// @desc: delete admin account
router.delete("/deleteAdminAcc/:id", async (req, res) => {
  try {
    const deletedAdminAcc = await Admin.findByIdAndDelete(req.params.id);
    res.json(deletedAdminAcc);
  } catch (e) {
    res.status(500).json(e);
  }
});
// ********************** OPTIONS PANEL APIS END *******************************

// ********************** LOAN APIS START *******************************
// @desc: get all loan docs from LOAN MODEL
router.get("/getLoanList", async (req, res) => {
  try {
    const loanList = await Loan.find({});
    res.json(loanList);
  } catch (e) {
    res.status(500).json(e);
  }
});

// @desc: get single emp's loan history
router.get("/getEmpLoanHistory/:id", async (req, res) => {
  try {
    const empLoanHistory = await Loan.find({ empId: req.params.id });
    res.json(empLoanHistory);
  } catch (e) {
    res.status(500).json(e);
  }
});

// @desc: mark particular loan as paid
router.put("/loanPaid", async (req, res) => {
  try {
    // update USER.notification MODEL
    const emp = await User.findById(req.body.empId);

    let notification = emp.notification;
    notification = notification.map((noti) => {
      if (noti.reqId === req.body.reqId) noti.loanRepaid = true;
      return noti;
    });

    await User.findByIdAndUpdate(req.body.empId, {
      notification,
    });

    // update LOAN MODEL
    const loan = await Loan.findByIdAndUpdate(
      req.body.loanId,
      {
        loanRepaid: true,
      },
      { new: true }
    );

    res.json(loan);
  } catch (e) {
    res.status(500).json(e);
  }
});
// ********************** LOAN APIS START *******************************
module.exports = router;
