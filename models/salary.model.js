const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const salarySchema = new Schema({
  empId: { type: String },
  empName: { type: String },
  basicPay: { type: String },
  totalLeaves: { type: String },
  travelAllowance: { type: String },
  medicalAllowance: { type: String },
  bonus: { type: String },
  salary: { type: String },
});

const Salary = mongoose.model("Salary", salarySchema);

module.exports = Salary;
