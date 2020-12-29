const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
let auth = require("../middleware/auth");
let User = require("../models/user.model");
let Admin = require("../models/admin.model");

// @desc: register a user
router.post("/register", async (req, res) => {
  try {
    let { email, password, passwordCheck, displayName } = req.body;

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

    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({
        msg: "The email address is already in use by another account.",
      });
    }

    if (!displayName) displayName = email;

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
      email,
      password: passwordHash,
      displayName,
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

// @desc: delete a user account
// router.delete("/delete/:id", auth, async (req, res) => {
//   try {
//     const deletedUser = await User.findByIdAndDelete(req.user);
//     res.json(deletedUser);

//     // delete this users todos too
//     await Todos.deleteMany({ userId: req.user }).catch(function (err) {
//       console.log(err);
//     });
//   } catch (err) {
//     res.status(500).json({ err: err.message });
//   }
// });

// @desc: update users history
// router.put("/updateHistory/", auth, async (req, res) => {
//   User.findOneAndUpdate({ _id: req.user }, { history: req.body }, function (
//     err,
//     result
//   ) {
//     if (err) {
//       res.status(400).json("Error: " + err);
//     } else {
//       res.json(result);
//     }
//   });
// });

// @desc: invite user
// router.post("/invite", async (req, res) => {
//   const toEmail = req.body.toEmail; //whome to invite
//   const fromEmail = req.body.fromEmail;
//   const taskId = req.body.taskId; //invite to this task id
//   const user = await User.findOne({ email: toEmail });

//   if (user) {
//     let inviteList = user.inviteList;
//     let alreadyInvited = false;

//     inviteList.forEach((invite) => {
//       if (invite.taskId === taskId) alreadyInvited = true;
//     });

//     if (alreadyInvited === false) {
//       //the user has not invited earlier
//       const invite = {
//         from: fromEmail,
//         taskId: taskId,
//         accepted: false,
//       };
//       inviteList.push(invite);

//       User.findOneAndUpdate(
//         { email: toEmail },
//         { inviteList },
//         { new: true }, //to get updated doc
//         (err, result) => {
//           if (err) {
//             res.status(400).json("Error: " + err);
//           } else {
//             res.json(result);
//           }
//         }
//       );
//     } else {
//       //user alerady invited
//       res.status(400).json({ msg: "User already invited/present" });
//     }
//   } else {
//     res.status(400).json({ msg: "User not found" });
//   }
// });

// @desc: update invite list user
// router.post("/updateInviteList", async (req, res) => {
//   const updatedInviteList = req.body.updatedInviteList;
//   const email = req.body.email;

//   User.findOneAndUpdate(
//     { email },
//     { inviteList: updatedInviteList },
//     (err, result) => {
//       if (err) {
//         res.status(400).json("Error: " + err);
//       } else {
//         res.json(result);
//       }
//     }
//   );
// });

// @desc: add task id to id list of the user
// router.post("/addTaskId", async (req, res) => {
//   const email = req.body.email;
//   const taskId = req.body.taskId;

//   const user = await User.findOne({ email: email });
//   let taskList = user.taskId;

//   if (user) {
//     taskList.push(taskId);
//   }

//   User.findOneAndUpdate(
//     { email },
//     { taskId: taskList },
//     { new: true }, //to get updated doc
//     (err, result) => {
//       if (err) {
//         res.status(400).json("Error: " + err);
//       }
//     }
//   );

//   // add the email to todo's memberList[]
//   const todo = await Todos.findById(taskId);

//   if (todo) {
//     let memberList = todo.memberList;
//     memberList.push(email);

//     Todos.findOneAndUpdate({ _id: taskId }, { memberList }, (err, result) => {
//       if (err) {
//         res.status(400).json("Error: " + err);
//       } else {
//         res.json(result);
//       }
//     });
//   }
// });

// @desc: remove task id from id list of the user (remove user from the team)
// router.post("/removeTaskId", async (req, res) => {
//   const emailToRemove = req.body.emailToRemove;
//   const taskIdToRemove = req.body.taskId;
//   console.log(emailToRemove, taskIdToRemove);
//   const userToRemove = await User.findOne({ email: emailToRemove });

//   if (userToRemove) {
//     let taskList = userToRemove.taskId;
//     const index = taskList.indexOf(taskIdToRemove);
//     // if task is present in tasklist, then only remove
//     if (index >= 0) {
//       taskList.splice(index, 1);

//       User.findOneAndUpdate(
//         { email: emailToRemove },
//         { taskId: taskList },
//         { new: true }, //to get updated doc
//         (err, result) => {
//           if (err) {
//             res.status(400).json("Error: " + err);
//           }
//         }
//       );

//       // remove the email from todo's memberList[]
//       const todo = await Todos.findById(taskIdToRemove);

//       if (todo) {
//         let memberList = todo.memberList;
//         memberList = memberList.filter((memberEmail) => {
//           if (memberEmail !== emailToRemove) return memberEmail;
//         });

//         Todos.findOneAndUpdate(
//           { _id: taskIdToRemove },
//           { memberList },
//           (err, result) => {
//             if (err) {
//               res.status(400).json("Error: " + err);
//             } else {
//               res.json(result);
//             }
//           }
//         );
//       }
//     } else {
//       res.status(400).json({ msg: "User not found" });
//     }
//   } else {
//     res.status(400).json({ msg: "User not found" });
//   }
// });

// @desc: get inviteList
// router.post("/getInviteList/", auth, async (req, res) => {
//   const user = await User.findById(req.user);

//   if (user) {
//     res.json(user.inviteList);
//   } else {
//     console.log("no user found");
//   }
// });

// // @desc: get team todos
// router.post("/getTeamTodos/", auth, async (req, res) => {
//   const user = await User.findById(req.user);
//   let taskIds = user.taskId;
//   let teamTodos = [];
//   // console.log("task ids before: ", taskIds);
//   for (let taskId = 0; taskId < taskIds.length; taskId++) {
//     const todo = await Todos.findById(taskIds[taskId]);
//     //check if todo actually exists or not
//     if (todo) {
//       teamTodos.push(todo);
//     } else {
//       // if the todo does not exist anymore, then delete it
//       const index = taskIds.indexOf(taskIds[taskId]);
//       taskIds.splice(index, 1);
//       taskId -= 1;
//     }
//   }

//   await User.findOneAndUpdate(
//     { _id: req.user },
//     { taskId: taskIds },
//     // { new: true }, //to get updated doc
//     (err, result) => {
//       if (err) {
//         console.log("oops error: ", err);
//       }
//     }
//   );

//   res.json(teamTodos);
// });

module.exports = router;
