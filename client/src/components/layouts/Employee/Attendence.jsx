import React, { Component } from "react";

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

  onSubmit = (e) => {
    e.preventDefault();
  };

  render() {
    return (
      <div className="container">
        <h1>apply for leave</h1>
        <form>
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
            type="button"
            className="btn btn-primary "
            onClick={this.onSubmit}
            value="Submit"
          />
        </form>

        <hr />

        <h1>mark attendence</h1>
      </div>
    );
  }
}
