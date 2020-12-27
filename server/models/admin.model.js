const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const adminSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 5 },
  name: { type: String },
  role: { type: String },
  leaveRequests: { type: Array },
  bonusRequests: { type: Array },
  loanRequests: { type: Array },
});

const Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin;
