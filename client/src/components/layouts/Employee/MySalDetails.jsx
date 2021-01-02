import axios from "axios";
import React, { Component } from "react";

export default class MySalReciept extends Component {
  constructor() {
    super();

    this.state = {
      basicPay: "",
      totalLeaves: "",
      travelAllowance: "",
      medicalAllowance: "",
      salary: "",
    };
  }

  async componentDidMount() {
    const userId = localStorage.getItem("userId");
    const userSalData = await axios.get(
      `/api/admin/getUserSalDetails/${userId}`
    );

    console.log(("sal details", userSalData.data));

    this.setState({
      basicPay: userSalData.data.basicPay,
      totalLeaves: userSalData.data.totalLeaves,
      travelAllowance: userSalData.data.travelAllowance,
      medicalAllowance: userSalData.data.medicalAllowance,
      salary: userSalData.data.salary,
    });
  }
  render() {
    return (
      <div className="jumbotron">
        <div className="card">
          <h1>salary Details</h1>
          <p>basic Pay: {this.state.basicPay}</p>
          <p>medical allowance: {this.state.medicalAllowance}</p>
          <p>travel allowance: {this.state.travelAllowance}</p>
          <p>total leaves: {this.state.totalLeaves}</p>
          <p>gross salary: {this.state.salary}</p>
        </div>
      </div>
    );
  }
}
