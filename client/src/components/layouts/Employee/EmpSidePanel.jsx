import React, { Component } from "react";
import { Link } from "react-router-dom";
import "../../../assets/side-panel-styles/sidePanel.css";

export default class EmpSidePanel extends Component {
  render() {
    const currLocation = window.location.href.split("#/")[1];

    return (
      <div className="mt-4">
        {/* timesheet*/}

        <Link to="/attendence" style={{ textDecoration: "none" }}>
          <li className="list-group-item text-dark border-0 my-1 myList">
            <i className="fas fa-clock mr-4" style={{ fontSize: "20px" }}></i>{" "}
            {currLocation === "attendence" ? <b>Timesheet</b> : "Timesheet"}
          </li>
        </Link>

        {/* send requests */}
        <ul className="list-group">
          <Link to="/otherRequest" style={{ textDecoration: "none" }}>
            <li className="list-group-item text-dark border-0 my-1 myList">
              <i
                className="fas fa-paper-plane mr-4"
                style={{ fontSize: "20px" }}
              ></i>{" "}
              {currLocation === "otherRequest" ? (
                <b>Send Request</b>
              ) : (
                "Send Request"
              )}
            </li>
          </Link>

          {/* view my requests */}
          <Link to="/myRequests" style={{ textDecoration: "none" }}>
            <li className="list-group-item text-dark border-0 my-1 myList">
              <i
                className="fas fa-ticket-alt mr-4"
                style={{ fontSize: "20px" }}
              ></i>{" "}
              {currLocation === "myRequests" ? <b>My Tickets</b> : "My Tickets"}
            </li>
          </Link>

          {/* sal details*/}
          <Link to="/mySalDetails" style={{ textDecoration: "none" }}>
            <li className="list-group-item text-dark border-0 my-1 myList">
              <i
                className="fas fa-money-check-alt mr-4"
                style={{ fontSize: "20px" }}
              ></i>{" "}
              {currLocation === "mySalDetails" ? (
                <b>Salary Details</b>
              ) : (
                "Salary Details"
              )}
            </li>
          </Link>

          {/* company info */}
          <Link to="/companyInfo" style={{ textDecoration: "none" }}>
            <li className="list-group-item text-dark border-0 my-1 myList">
              <i
                className="fas fa-info-circle mr-4"
                style={{ fontSize: "20px" }}
              ></i>{" "}
              {currLocation === "companyInfo" ? (
                <b>Company Info</b>
              ) : (
                "Company Info"
              )}
            </li>
          </Link>
        </ul>
      </div>
    );
  }
}
