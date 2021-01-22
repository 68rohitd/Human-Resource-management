import axios from "axios";
import React, { Component } from "react";
import { Consumer } from "../../../context";
import { v4 as uuidv4 } from "uuid";
import { Redirect } from "react-router-dom";
import EmpSidePanel from "./EmpSidePanel";
import toast from "toasted-notes";
import "toasted-notes/src/styles.css";
import classNames from "classnames";
import { Spring } from "react-spring/renderprops";
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

      // file
      attachLoanFile: false,
      attachBonusFile: false,
      attachmentName: "",
      file: "",
    };
  }

  onChange = (e) => this.setState({ [e.target.name]: e.target.value });

  onUploadFile = async () => {
    // upload file if selected
    if (this.state.file) {
      const data = new FormData();
      data.append("file", this.state.file);

      const config = {
        headers: {
          "content-type": "multipart/form-data",
        },
      };

      try {
        const fileUploadRes = await axios.post(
          "/api/users/uploadfile",
          data,
          config
        );

        console.log(fileUploadRes.data.filename);

        this.setState({ attachmentName: fileUploadRes.data.filename });
      } catch (err) {
        console.log(err);
      }
    }
  };

  onBonusSubmit = async (user, e) => {
    e.preventDefault();

    await this.onUploadFile();

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
      date: new Date(),
      empTeam: user.team,
      empEmail: user.email,
      bonusNote: this.state.bonusNote,
      attachmentName: this.state.attachmentName,
      bonusReason,
      approved: false,
      ticketClosed: false,
    };

    // push to admin notification
    const res = await axios.put("/api/users/bonusRequest", {
      request,
    });

    toast.notify("Successfully submitted bonus request", {
      position: "top-right",
    });

    this.props.history.push("/myRequests");

    console.log("res: ", res.data);
  };

  onLoanSubmit = async (user, e) => {
    e.preventDefault();

    await this.onUploadFile();

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
      attachmentName: this.state.attachmentName,
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

    this.props.history.push("/myRequests");
    console.log("successfully submitted req: ", res.data);
  };

  onReasonSelect = (loanReason) =>
    this.setState({ loanReason, otherLoanReason: "" });

  onModeOfRepaymentSelect = (ModeOfRepayment) =>
    this.setState({ ModeOfRepayment });

  onBonusReasonSelect = (bonusReason) => this.setState({ bonusReason });

  onFileChange = (e) => {
    try {
      console.log(e.target.files[0]);
      this.setState({
        file: e.target.files[0],
        attachmentName: e.target.files[0].name,
      });
    } catch (e) {
      console.log(e);
    }
  };

  clearFile = (e) => {
    e.preventDefault();
    console.log("clearing...");
    this.fileInput.value = "";
    this.setState({ file: "", attachmentName: "" });
  };

  render() {
    return (
      <Consumer>
        {(value) => {
          let { user } = value;
          const token = localStorage.getItem("auth-token");
          if (!token) return <Redirect to="/login" />;

          if (user && user.role === "admin") return <Redirect to="/" />;

          return (
            <Spring
              // from={{ opacity: 0 }}
              // to={{ opacity: 1 }}
              // config={{ duration: 300 }}
              from={{
                transform: "translate3d(0,-1000px,0) ",
              }}
              to={{
                transform: "translate3d(0px,0,0) ",
              }}
              config={{ friction: 20 }}
            >
              {(props) => (
                <div className="row m-0">
                  {/* left part */}
                  <div className="col-2 p-0 leftPart">
                    <EmpSidePanel />
                  </div>

                  {/* right part */}
                  <div className="col rightPart container" style={props}>
                    <div className="row">
                      {/* loan col */}
                      <div className="col ml-5">
                        <form
                          className="addEmpForm"
                          onSubmit={this.onLoanSubmit.bind(this, user)}
                        >
                          <h2>Request for Loan</h2>
                          <hr />

                          <div className="row">
                            {/* reason dropdown */}
                            <div className="col">
                              <div className="form-group">
                                <label htmlFor="loanReason">Loan Reason</label>
                                <div className="dropdown">
                                  <button
                                    className="btn btn-primary dropdown-toggle"
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
                                      style={{ cursor: "pointer" }}
                                      className="dropdown-item btn-primary"
                                      onClick={() =>
                                        this.onReasonSelect(
                                          "Medical Expenditure"
                                        )
                                      }
                                    >
                                      Medical Expenditure
                                    </li>
                                    <li
                                      style={{ cursor: "pointer" }}
                                      className="dropdown-item btn-primary"
                                      onClick={() =>
                                        this.onReasonSelect(
                                          "Moving Expenditure"
                                        )
                                      }
                                    >
                                      Moving Expenditure
                                    </li>
                                    <li
                                      style={{ cursor: "pointer" }}
                                      className="dropdown-item btn-primary"
                                      onClick={() =>
                                        this.onReasonSelect("Buy Assets")
                                      }
                                    >
                                      Buy Assets
                                    </li>
                                    <li
                                      style={{ cursor: "pointer" }}
                                      className="dropdown-item btn-primary"
                                      onClick={() =>
                                        this.onReasonSelect("Other")
                                      }
                                    >
                                      Other
                                    </li>
                                  </div>
                                </div>

                                {this.state.loanReason === "Other" ? (
                                  <input
                                    required
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
                                    className="btn btn-primary dropdown-toggle"
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
                                      style={{ cursor: "pointer" }}
                                      className="dropdown-item btn-primary"
                                      onClick={() =>
                                        this.onModeOfRepaymentSelect(
                                          "Deduction from salary"
                                        )
                                      }
                                    >
                                      Deduction from salary
                                    </li>
                                    <li
                                      style={{ cursor: "pointer" }}
                                      className="dropdown-item btn-primary"
                                      onClick={() =>
                                        this.onModeOfRepaymentSelect(
                                          "One Time Payment"
                                        )
                                      }
                                    >
                                      One Time Payment
                                    </li>
                                    <li
                                      style={{ cursor: "pointer" }}
                                      className="dropdown-item btn-primary"
                                      onClick={() =>
                                        this.onModeOfRepaymentSelect(
                                          "Installment"
                                        )
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
                            <label htmlFor="reason">
                              Explain reason in brief
                            </label>
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

                          {/* attachment */}
                          <div className="form-group">
                            <div className="row">
                              <div className="col-11">
                                <p
                                  className="text-secondary"
                                  style={{ cursor: "pointer" }}
                                  onClick={() =>
                                    this.setState({
                                      attachLoanFile: !this.state
                                        .attachLoanFile,
                                    })
                                  }
                                >
                                  Attachment (if any){" "}
                                  <i
                                    className={classNames("fa", {
                                      "fa-caret-down": !this.state
                                        .attachLoanFile,
                                      "fa-caret-up": this.state.attachLoanFile,
                                    })}
                                  ></i>
                                </p>
                                {this.state.attachLoanFile ? (
                                  <div className="input-group mb-3">
                                    <div className="custom-file">
                                      <input
                                        type="file"
                                        id="file"
                                        className="custom-file-input"
                                        onChange={this.onFileChange}
                                        ref={(ref) => (this.fileInput = ref)}
                                      />
                                      <label
                                        className="custom-file-label"
                                        htmlFor="file"
                                      >
                                        {this.state.attachmentName
                                          ? this.state.attachmentName
                                          : "Upload file"}
                                      </label>
                                    </div>
                                    <div className="input-group-append">
                                      <span
                                        style={{ cursor: "pointer" }}
                                        onClick={this.clearFile}
                                        className="input-group-text"
                                        id="file"
                                      >
                                        Clear
                                      </span>
                                    </div>
                                  </div>
                                ) : null}
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
                      <div className="col mr-5">
                        <form
                          className="addEmpForm"
                          onSubmit={this.onBonusSubmit.bind(this, user)}
                        >
                          <h2>Request for Bonus</h2>
                          <hr />

                          <div className="form-group">
                            <label htmlFor="paymentMode">Bonus Reason</label>

                            {/* bonus reason dropdown */}
                            <div className="form-group">
                              <div className="dropdown">
                                <button
                                  className="btn btn-primary dropdown-toggle"
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
                                    style={{ cursor: "pointer" }}
                                    className="dropdown-item btn-primary"
                                    onClick={() =>
                                      this.onBonusReasonSelect(
                                        "Employee Referral Program"
                                      )
                                    }
                                  >
                                    Employee Referral Program
                                  </li>
                                  <li
                                    style={{ cursor: "pointer" }}
                                    className="dropdown-item btn-primary"
                                    onClick={() =>
                                      this.onBonusReasonSelect(
                                        "Exceptional Achievement"
                                      )
                                    }
                                  >
                                    Exceptional Achievement
                                  </li>
                                  <li
                                    style={{ cursor: "pointer" }}
                                    className="dropdown-item btn-primary"
                                    onClick={() =>
                                      this.onBonusReasonSelect(
                                        "Exceptional Service"
                                      )
                                    }
                                  >
                                    Exceptional Service
                                  </li>
                                  <li
                                    style={{ cursor: "pointer" }}
                                    className="dropdown-item btn-primary"
                                    onClick={() =>
                                      this.onBonusReasonSelect(
                                        "Special Project(s)"
                                      )
                                    }
                                  >
                                    Special Project(s)
                                  </li>
                                  <li
                                    style={{ cursor: "pointer" }}
                                    className="dropdown-item btn-primary"
                                    onClick={() =>
                                      this.onBonusReasonSelect("Budget Savings")
                                    }
                                  >
                                    Budget Savings
                                  </li>
                                  <li
                                    style={{ cursor: "pointer" }}
                                    className="dropdown-item btn-primary"
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
                                  required={true}
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

                          {/* attachment */}
                          <div className="form-group">
                            <div className="row">
                              <div className="col-11">
                                <p
                                  className="text-secondary"
                                  style={{ cursor: "pointer" }}
                                  onClick={() =>
                                    this.setState({
                                      attachBonusFile: !this.state
                                        .attachBonusFile,
                                    })
                                  }
                                >
                                  Attachment (if any){" "}
                                  <i
                                    className={classNames("fa", {
                                      "fa-caret-down": !this.state
                                        .attachBonusFile,
                                      "fa-caret-up": this.state.attachBonusFile,
                                    })}
                                  ></i>
                                </p>
                                {this.state.attachBonusFile ? (
                                  <div className="input-group mb-3">
                                    <div className="custom-file">
                                      <input
                                        type="file"
                                        id="file"
                                        className="custom-file-input"
                                        onChange={this.onFileChange}
                                        ref={(ref) => (this.fileInput = ref)}
                                      />
                                      <label
                                        className="custom-file-label"
                                        htmlFor="file"
                                      >
                                        {this.state.attachmentName
                                          ? this.state.attachmentName
                                          : "Upload file"}
                                      </label>
                                    </div>
                                    <div className="input-group-append">
                                      <span
                                        style={{ cursor: "pointer" }}
                                        onClick={this.clearFile}
                                        className="input-group-text"
                                        id="file"
                                      >
                                        Clear
                                      </span>
                                    </div>
                                  </div>
                                ) : null}
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
                    </div>
                  </div>
                </div>
              )}
            </Spring>
          );
        }}
      </Consumer>
    );
  }
}
