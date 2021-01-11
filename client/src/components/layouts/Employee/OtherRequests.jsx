import axios from "axios";
import React, { Component } from "react";
import { Consumer } from "../../../context";
import { v4 as uuidv4 } from "uuid";
import { Redirect } from "react-router-dom";

export default class otherRequest extends Component {
  constructor() {
    super();

    this.state = {
      bonusNote: "",
      loanNote: "",
      amount: "",
    };
  }

  onChange = (e) => this.setState({ [e.target.name]: e.target.value });

  onBonusSubmit = async (user, e) => {
    e.preventDefault();

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
      approved: false,
      ticketClosed: false,
      loanRepaid: false,
    };

    // push to admin notification
    const res = await axios.put("/api/users/loanRequest", {
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
              <h1>Req for bonus</h1>
              <form onSubmit={this.onBonusSubmit.bind(this, user)}>
                <div className="form-group">
                  <label htmlFor="reason">note</label>
                  <input
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
                  value="send request"
                />
              </form>

              <hr />

              <h1>req for loan</h1>
              <form onSubmit={this.onLoanSubmit.bind(this, user)}>
                <div className="form-group">
                  <label htmlFor="reason">amt </label>
                  <input
                    type="number"
                    name="amount"
                    className="form-control"
                    id="amount"
                    value={this.state.amount}
                    onChange={this.onChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="reason">note</label>
                  <input
                    type="text"
                    name="loanNote"
                    className="form-control"
                    id="loanNote"
                    value={this.state.loanNote}
                    onChange={this.onChange}
                  />
                </div>
                <input
                  type="submit"
                  className="btn btn-primary"
                  value="send request"
                />
              </form>
            </div>
          );
        }}
      </Consumer>
    );
  }
}
