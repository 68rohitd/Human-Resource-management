const mongoose = require("mongoose");

const Schema = mongoose.Schema;

// only approved loans would be saved here..
const loanSchema = new Schema({
  reqId: { type: String },
  empId: { type: String },
  date: { type: String },
  empName: { type: String },
  gender: { type: String },
  empRole: { type: String },
  empTeam: { type: String },
  empEmail: { type: String },
  loanNote: { type: String },
  loanReason: { type: String },
  modeOfRepayment: { type: String },
  timePeriod: { type: String },
  amount: { type: String },
  loanRepaid: { type: Boolean },
});

const Loan = mongoose.model("Loan", loanSchema);

module.exports = Loan;
