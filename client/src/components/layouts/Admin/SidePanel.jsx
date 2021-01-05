import React, { Component } from "react";
import { Link } from "react-router-dom";

export default class SidePanel extends Component {
  render() {
    return (
      <div className="sidePanel container">
        {/* add emp */}
        <ul className="list-group">
          <Link to="/add" style={{ textDecoration: "none" }}>
            <li className="list-group-item text-dark font-weight-bold">
              add emp
            </li>
          </Link>

          {/* view req*/}
          <Link to="/viewRequests" style={{ textDecoration: "none" }}>
            <li className="list-group-item text-dark font-weight-bold">
              view req
            </li>
          </Link>

          {/* view emp */}
          <Link to="/viewEmployees" style={{ textDecoration: "none" }}>
            <li className="list-group-item text-dark font-weight-bold">
              view emp
            </li>
          </Link>

          {/* payroll */}
          <Link to="/payroll" style={{ textDecoration: "none" }}>
            <li className="list-group-item text-dark font-weight-bold">
              payroll
            </li>
          </Link>

          {/* stats*/}
          <Link to="/statistics" style={{ textDecoration: "none" }}>
            <li className="list-group-item text-dark font-weight-bold">
              stats
            </li>
          </Link>
        </ul>
      </div>
    );
  }
}
