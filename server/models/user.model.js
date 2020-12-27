const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 5 },
  name: { type: String },
  address: { type: String },
  phoneNo: { type: String },
  role: { type: String },
  salary: { type: String },
  team: { type: String },
  objective: { type: String },
  skills: { type: String },
  doj: { type: String },
  notification: { type: Array },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
