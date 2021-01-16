import React, { Component } from "react";
import { Link } from "react-router-dom";
import "../../../assets/side-panel-styles/sidePanel.css";

export default class SidePanel extends Component {
  render() {
    const currLocation = window.location.href.split("#/")[1];
    console.log(currLocation);
    return (
      <div className="mt-4">
        {/* stats*/}
        <Link to="/statistics" style={{ textDecoration: "none" }}>
          <li className="list-group-item text-dark border-0 my-1 myList">
            <i
              className="fas fa-chart-bar mr-4"
              style={{ fontSize: "20px" }}
            ></i>{" "}
            {currLocation === "statistics" || currLocation === "" ? (
              <b>Statistics</b>
            ) : (
              "Statistics"
            )}
          </li>
        </Link>

        {/* add emp */}
        <ul className="list-group">
          <Link to="/add" style={{ textDecoration: "none" }}>
            <li className="list-group-item text-dark border-0 my-1 myList">
              <i
                className="fas fa-user-plus mr-4"
                style={{ fontSize: "20px" }}
              ></i>{" "}
              {currLocation === "add" ? <b>Add Employee</b> : "Add Employee"}
            </li>
          </Link>

          {/* view emp */}
          <Link to="/viewEmployees" style={{ textDecoration: "none" }}>
            <li className="list-group-item text-dark border-0 my-1 myList">
              <i
                className="fas fa-search mr-4"
                style={{ fontSize: "20px" }}
              ></i>{" "}
              {currLocation === "viewEmployees" ? (
                <b>View Employee</b>
              ) : (
                "View Employee"
              )}
            </li>
          </Link>

          {/* view req*/}
          <Link to="/viewRequests" style={{ textDecoration: "none" }}>
            <li className="list-group-item text-dark border-0 my-1 myList">
              <i
                className="fas fa-comments mr-4"
                style={{ fontSize: "20px" }}
              ></i>{" "}
              {currLocation === "viewRequests" ? (
                <b>View Requests</b>
              ) : (
                "View Requests"
              )}
            </li>
          </Link>

          {/* payroll */}
          <Link to="/payroll" style={{ textDecoration: "none" }}>
            <li className="list-group-item text-dark border-0 my-1 myList">
              <i
                className="fas fa-file-invoice mr-4"
                style={{ fontSize: "20px" }}
              ></i>{" "}
              {currLocation === "payroll" ? <b>Payroll</b> : "Payroll"}
            </li>
          </Link>

          {/* options */}
          <Link to="/options" style={{ textDecoration: "none" }}>
            <li className="list-group-item text-dark border-0 my-1 myList">
              <i
                className="fas fa-sliders-h mr-4"
                style={{ fontSize: "20px" }}
              ></i>{" "}
              {currLocation === "options" ? <b>Options</b> : "Options"}
            </li>
          </Link>
        </ul>
      </div>
    );
  }
}
