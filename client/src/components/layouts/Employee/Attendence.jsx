import axios from "axios";
import React, { Component } from "react";
import { Consumer } from "../../../context";
import { v4 as uuidv4 } from "uuid";
import { Redirect } from "react-router-dom";
import EmpSidePanel from "./EmpSidePanel";
import toast from "toasted-notes";
import "toasted-notes/src/styles.css";

export default class Attendence extends Component {
  constructor() {
    super();

    this.state = {
      fromDate: "",
      toDate: "",
      reason: "",
    };
  }

  onChange = (e) => this.setState({ [e.target.name]: e.target.value });

  onSubmit = async (user, e) => {
    e.preventDefault();

    const request = {
      title: "leave request",
      reqId: uuidv4(),
      empId: user._id,
      empName: user.name,
      gender: user.gender,
      empRole: user.role,
      empTeam: user.team,
      subject: "Leave request",
      empEmail: user.email,
      date: new Date(),
      fromDate: this.state.fromDate,
      toDate: this.state.toDate,
      reason: this.state.reason,
      approved: false,
      ticketClosed: false,
    };

    // push to admin notification
    const res = await axios.put("/api/users/applyLeave", {
      request,
    });

    toast.notify("Successfully submitted loan request", {
      position: "top-right",
    });

    console.log("res: ", res.data);
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
            <div className="row m-0">
              {/* left part */}
              <div className="col-2 p-0 leftPart">
                <EmpSidePanel />
              </div>

              {/* right part */}
              <div
                className="col rightPart container"
                style={{
                  display: "flex ",
                  flexDirection: "row",
                  justifyContent: "center",
                }}
              >
                <form
                  className="addEmpForm"
                  onSubmit={this.onSubmit.bind(this, user)}
                >
                  <h2>Apply for Leave</h2>
                  <hr />
                  <div className="row">
                    <div className="col">
                      <div className="form-group">
                        <label htmlFor="fromDate">From</label>
                        <input
                          type="date"
                          name="fromDate"
                          className="form-control"
                          id="fromDate"
                          value={this.state.fromDate}
                          onChange={this.onChange}
                        />
                      </div>
                    </div>
                    <div className="col">
                      <div className="form-group">
                        <label htmlFor="toDate">To</label>
                        <input
                          type="date"
                          name="toDate"
                          className="form-control"
                          id="toDate"
                          value={this.state.toDate}
                          onChange={this.onChange}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col">
                      <div className="form-group">
                        <label htmlFor="reason">Reason</label>
                        <textarea
                          type="text"
                          name="reason"
                          className="form-control"
                          id="reason"
                          rows="5"
                          value={this.state.reason}
                          onChange={this.onChange}
                        />
                      </div>
                    </div>
                  </div>
                  <input
                    type="submit"
                    className="btn btn-primary"
                    value="Submit"
                  />
                </form>
              </div>
            </div>
          );
        }}
      </Consumer>
    );
  }
}
