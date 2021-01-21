import axios from "axios";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import "../../../assets/side-panel-styles/sidePanel.css";
import AlertCard from "./AlertCard";

export default class EmpSidePanel extends Component {
  constructor() {
    super();

    this.state = {
      alerts: [],
    };
  }

  componentDidMount = async () => {
    const id = localStorage.getItem("userId");
    const alerts = await axios.get(`/api/users/getAlerts/${id}`);

    // console.log(alerts.data);

    this.setState({ alerts: alerts.data });
  };

  onDeleteAlert = async (reqId) => {
    console.log("deleting...: ", reqId);
    const id = localStorage.getItem("userId");
    const deletedAlert = await axios.put("/api/users/deleteAlert", {
      reqId,
      id,
    });
    console.log("deleted alert: ", deletedAlert.data);
  };

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

        {this.state.alerts.length
          ? this.state.alerts.map((msg, index) => (
              <AlertCard
                key={index}
                data={msg}
                onDeleteAlert={this.onDeleteAlert}
              />
            ))
          : null}
      </div>
    );
  }
}
