import React, { Component } from "react";
import { Link } from "react-router-dom";

export default class EmpDashboard extends Component {
  render() {
    return (
      <div className="container">
        <Link to="/attendence">
          <button className="btn btn-secondary">manage attendence</button>
        </Link>
      </div>
    );
  }
}
