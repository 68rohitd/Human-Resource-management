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

      // payslip
      selectedMonth: "Select Month",
      salDetails: undefined,
    };

    this.curYear = new Date().getFullYear();

    this.month = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
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

  onMonthClick = (month) => {
    this.setState({
      selectedMonth: month,
    });
  };

  onFindSalReceipt = async () => {
    const userId = localStorage.getItem("userId");
    const empSalReceipts = await axios.get(
      `/api/admin/getSingleEmpSalReceipts/${userId}`
    );

    let monthDetails;
    empSalReceipts.data.monthlyReceipts.forEach((item) => {
      if (item.month === this.state.selectedMonth) {
        monthDetails = item;
      }
    });
    this.setState({ salDetails: monthDetails });
  };

  render() {
    return (
      <>
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

        <div>
          <h2>payslip</h2>
          <div className="container">
            {/* select month */}
            <div className="dropdown">
              <button
                className="btn btn-secondary dropdown-toggle"
                type="button"
                id="dropdownMenuButton"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                {this.state.selectedMonth}
              </button>
              <div
                className="dropdown-menu"
                aria-labelledby="dropdownMenuButton"
              >
                {this.month.map((m) => {
                  return (
                    <li
                      key={m}
                      className="dropdown-item"
                      onClick={() => this.onMonthClick(m)}
                    >
                      {m}
                    </li>
                  );
                })}
              </div>
            </div>

            <input
              type="button"
              className="btn btn-primary"
              value="search"
              onClick={this.onFindSalReceipt}
            />

            {this.state.salDetails ? (
              <div className="jumbotron">
                <h1>month: {this.state.salDetails.month} </h1>
                <h1>year: {this.state.salDetails.year} </h1>
                <p>basic pay: {this.state.salDetails.salDetails.basicPay} </p>
                <p>
                  medical allowance:{" "}
                  {this.state.salDetails.salDetails.medicalAllowance}{" "}
                </p>
                <p>
                  travelling allowance:{" "}
                  {this.state.salDetails.salDetails.travelAllowance}{" "}
                </p>
                <p>
                  total leaves: {this.state.salDetails.salDetails.totalLeaves}{" "}
                </p>
                <p>gross: {this.state.salDetails.salDetails.salary} </p>
              </div>
            ) : (
              <h1>no data to show</h1>
            )}
          </div>
        </div>
      </>
    );
  }
}
