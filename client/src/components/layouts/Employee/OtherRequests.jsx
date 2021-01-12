import axios from "axios";
import React, { Component } from "react";
import { Consumer } from "../../../context";
import { v4 as uuidv4 } from "uuid";
import { Redirect } from "react-router-dom";
import EmpSidePanel from "./EmpSidePanel";
import toast from "toasted-notes";
import "toasted-notes/src/styles.css";

export default class otherRequest extends Component {
  constructor() {
    super();

    this.state = {
      // loan related
      loanReason: "Medical Expenditure",
      otherLoanReason: "",
      loanNote: "",
      ModeOfRepayment: "Deduction from salary",
      amount: "",
      timePeriod: "",

      // bonus related
      bonusReason: "Employee Referral Program",
      otherBonusReason: "",
      bonusNote: "",
    };
  }

  onChange = (e) => this.setState({ [e.target.name]: e.target.value });

  onBonusSubmit = async (user, e) => {
    e.preventDefault();

    let bonusReason = this.state.otherBonusReason
      ? this.state.otherBonusReason
      : this.state.bonusReason;

    const request = {
      title: "bonus request",
      reqId: uuidv4(),
      empId: user._id,
      empName: user.name,
      gender: user.gender,
      empRole: user.role,
      empTeam: user.team,
      empEmail: user.email,
      bonusNote: this.state.bonusNote,
      bonusReason,
      approved: false,
      ticketClosed: false,
    };

    // push to admin notification
    const res = await axios.put("/api/users/bonusRequest", {
      request,
    });

    console.log("res: ", res.data);
  };

  onLoanSubmit = async (user, e) => {
    e.preventDefault();

    let loanReason = this.state.otherLoanReason
      ? this.state.otherLoanReason
      : this.state.loanReason;

    const request = {
      title: "loan request",
      reqId: uuidv4(),
      empId: user._id,
      date: new Date(),
      empName: user.name,
      gender: user.gender,
      empRole: user.role,
      empTeam: user.team,
      empEmail: user.email,
      loanNote: this.state.loanNote,
      amount: this.state.amount,
      loanReason,
      modeOfRepayment: this.state.ModeOfRepayment,
      timePeriod: this.state.timePeriod,
      approved: false,
      ticketClosed: false,
      loanRepaid: false,
    };

    // push to admin notification
    const res = await axios.put("/api/users/loanRequest", {
      request,
    });

    toast.notify("Successfully submitted loan request", {
      position: "top-right",
    });

    console.log("successfully submitted req: ", res.data);
  };

  onReasonSelect = (loanReason) =>
    this.setState({ loanReason, otherLoanReason: "" });

  onModeOfRepaymentSelect = (ModeOfRepayment) =>
    this.setState({ ModeOfRepayment });

  onBonusReasonSelect = (bonusReason) => this.setState({ bonusReason });

  render() {
    return (
      <Consumer>
        {(value) => {
          let { user } = value;
          const token = localStorage.getItem("auth-token");

          if (!token) return <Redirect to="/" />;

          return (
            <div className="row m-0">
              {/* left part */}
              <div className="col-2 p-0 leftPart">
                <EmpSidePanel />
              </div>

              {/* right part */}
              <div className="col rightPart container">
                <div className="row">
                  {/* loan col */}
                  <div className="col mx-5">
                    <form
                      className="addEmpForm"
                      onSubmit={this.onLoanSubmit.bind(this, user)}
                    >
                      <h1>Request for Loan</h1>
                      <hr />

                      <div className="row">
                        {/* reason dropdown */}
                        <div className="col">
                          <div className="form-group">
                            <label htmlFor="loanReason">Loan Reason</label>
                            <div className="dropdown">
                              <button
                                className="btn btn-secondary dropdown-toggle"
                                type="button"
                                id="dropdownMenuButton"
                                data-toggle="dropdown"
                                aria-haspopup="true"
                                aria-expanded="false"
                              >
                                {this.state.loanReason}
                              </button>
                              <div
                                className="dropdown-menu"
                                aria-labelledby="dropdownMenuButton"
                              >
                                <li
                                  className="dropdown-item"
                                  onClick={() =>
                                    this.onReasonSelect("Medical Expenditure")
                                  }
                                >
                                  Medical Expenditure
                                </li>
                                <li
                                  className="dropdown-item"
                                  onClick={() =>
                                    this.onReasonSelect("Moving Expenditure")
                                  }
                                >
                                  Moving Expenditure
                                </li>
                                <li
                                  className="dropdown-item"
                                  onClick={() =>
                                    this.onReasonSelect("Buy Assets")
                                  }
                                >
                                  Buy Assets
                                </li>
                                <li
                                  className="dropdown-item"
                                  onClick={() => this.onReasonSelect("Other")}
                                >
                                  Other
                                </li>
                              </div>
                            </div>

                            {this.state.loanReason === "Other" ? (
                              <input
                                type="text"
                                name="otherLoanReason"
                                className="form-control mt-2"
                                placeholder="Other reason"
                                onChange={this.onChange}
                                value={this.state.otherLoanReason}
                              />
                            ) : null}
                          </div>
                        </div>

                        {/* mode of repayment */}
                        <div className="col">
                          <div className="form-group">
                            <label htmlFor="paymentMode">
                              Mode of Repayment
                            </label>

                            {/* mode of payment dropdown */}
                            <div className="dropdown">
                              <button
                                className="btn btn-secondary dropdown-toggle"
                                type="button"
                                id="dropdownMenuButton2"
                                data-toggle="dropdown"
                                aria-haspopup="true"
                                aria-expanded="false"
                              >
                                {this.state.ModeOfRepayment}
                              </button>
                              <div
                                className="dropdown-menu"
                                aria-labelledby="dropdownMenuButton2"
                              >
                                <li
                                  className="dropdown-item"
                                  onClick={() =>
                                    this.onModeOfRepaymentSelect(
                                      "Deduction from salary"
                                    )
                                  }
                                >
                                  Deduction from salary
                                </li>
                                <li
                                  className="dropdown-item"
                                  onClick={() =>
                                    this.onModeOfRepaymentSelect(
                                      "One Time Payment"
                                    )
                                  }
                                >
                                  One Time Payment
                                </li>
                                <li
                                  className="dropdown-item"
                                  onClick={() =>
                                    this.onModeOfRepaymentSelect("Installment")
                                  }
                                >
                                  Installment
                                </li>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="form-group">
                        <label htmlFor="reason">Explain reason in brief</label>
                        <textarea
                          required={true}
                          type="text"
                          name="loanNote"
                          className="form-control"
                          id="loanNote"
                          value={this.state.loanNote}
                          onChange={this.onChange}
                        />
                      </div>

                      <div className="row">
                        <div className="col">
                          <div className="form-group">
                            <label htmlFor="reason">Loan Amount </label>
                            <input
                              required={true}
                              type="number"
                              name="amount"
                              className="form-control"
                              id="amount"
                              value={this.state.amount}
                              onChange={this.onChange}
                            />
                          </div>
                        </div>
                        <div className="col">
                          <div className="form-group">
                            <label htmlFor="reason">
                              Time Period (in months)
                            </label>
                            <input
                              required={true}
                              type="number"
                              name="timePeriod"
                              className="form-control"
                              id="timePeriod"
                              value={this.state.timePeriod}
                              onChange={this.onChange}
                            />
                          </div>
                        </div>
                      </div>

                      <input
                        type="submit"
                        className="btn btn-primary"
                        value="Submit Request"
                      />
                    </form>
                  </div>

                  {/* bonus col */}
                  <div className="col mx-5">
                    <form
                      className="addEmpForm"
                      onSubmit={this.onBonusSubmit.bind(this, user)}
                    >
                      <h1>Request for Bonus</h1>
                      <hr />

                      <div className="form-group">
                        <label htmlFor="paymentMode">Bonus Reason</label>

                        {/* bonus reason dropdown */}
                        <div className="form-group">
                          <div className="dropdown">
                            <button
                              className="btn btn-secondary dropdown-toggle"
                              type="button"
                              id="dropdownMenuButton2"
                              data-toggle="dropdown"
                              aria-haspopup="true"
                              aria-expanded="false"
                            >
                              {this.state.bonusReason}
                            </button>
                            <div
                              className="dropdown-menu"
                              aria-labelledby="dropdownMenuButton2"
                            >
                              <li
                                className="dropdown-item"
                                onClick={() =>
                                  this.onBonusReasonSelect(
                                    "Employee Referral Program"
                                  )
                                }
                              >
                                Employee Referral Program
                              </li>
                              <li
                                className="dropdown-item"
                                onClick={() =>
                                  this.onBonusReasonSelect(
                                    "Exceptional Achievement"
                                  )
                                }
                              >
                                Exceptional Achievement
                              </li>
                              <li
                                className="dropdown-item"
                                onClick={() =>
                                  this.onBonusReasonSelect(
                                    "Exceptional Service"
                                  )
                                }
                              >
                                Exceptional Service
                              </li>
                              <li
                                className="dropdown-item"
                                onClick={() =>
                                  this.onBonusReasonSelect("Special Project(s)")
                                }
                              >
                                Special Project(s)
                              </li>
                              <li
                                className="dropdown-item"
                                onClick={() =>
                                  this.onBonusReasonSelect("Budget Savings")
                                }
                              >
                                Budget Savings
                              </li>
                              <li
                                className="dropdown-item"
                                onClick={() =>
                                  this.onBonusReasonSelect("Other")
                                }
                              >
                                Other
                              </li>
                            </div>
                          </div>

                          {this.state.bonusReason === "Other" ? (
                            <input
                              type="text"
                              className="form-control mt-2"
                              name="otherBonusReason"
                              placeholder="Other reason"
                              value={this.state.otherBonusReason}
                              onChange={this.onChange}
                            />
                          ) : null}
                        </div>
                      </div>

                      <div className="form-group">
                        <label htmlFor="reason">
                          Explain the circumstances
                        </label>
                        <textarea
                          required={true}
                          type="text"
                          name="bonusNote"
                          className="form-control"
                          id="bonusNote"
                          value={this.state.bonusNote}
                          onChange={this.onChange}
                        />
                      </div>

                      <input
                        type="submit"
                        className="btn btn-primary"
                        value="Submit Request"
                      />
                    </form>
                  </div>
                </div>
              </div>
            </div>
          );
        }}
      </Consumer>
    );
  }
}
