import axios from "axios";
import React, { Component } from "react";
import { Consumer } from "../../../context";
import { v4 as uuidv4 } from "uuid";
import { Redirect } from "react-router-dom";

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
      empRole: user.role,
      empTeam: user.team,
      empEmail: user.email,
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

    console.log("res: ", res.data);
  };

  render() {
    return (
      <Consumer>
        {(value) => {
          let { user } = value;
          const token = localStorage.getItem("auth-token");

          if (!token) return <Redirect to="/" />;

          return (
            <div className="container">
              <h1>apply for leave</h1>
              <form onSubmit={this.onSubmit.bind(this, user)}>
                <div className="form-group">
                  <label htmlFor="fromDate">from</label>
                  <input
                    type="date"
                    name="fromDate"
                    className="form-control"
                    id="fromDate"
                    value={this.state.fromDate}
                    onChange={this.onChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="toDate">to</label>
                  <input
                    type="date"
                    name="toDate"
                    className="form-control"
                    id="toDate"
                    value={this.state.toDate}
                    onChange={this.onChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="reason">reason</label>
                  <input
                    type="text"
                    name="reason"
                    className="form-control"
                    id="reason"
                    value={this.state.reason}
                    onChange={this.onChange}
                  />
                </div>
                <input
                  type="submit"
                  className="btn btn-primary"
                  value="Submit"
                />
              </form>

              <hr />

              <h1>mark attendence</h1>
            </div>
          );
        }}
      </Consumer>
    );
  }
}
