import axios from "axios";
import React, { Component } from "react";
import EmpSidePanel from "./EmpSidePanel";
import "../../../assets/my-sal-details/mySalDetails.css";
import SalaryStructure from "./SalaryStructure";
import { Consumer } from "../../../context";
import { Redirect } from "react-router-dom";
import { Spring } from "react-spring/renderprops";

export default class MySalReciept extends Component {
  constructor() {
    super();

    this.state = {
      basicPay: "",
      totalLeaves: "",
      travelAllowance: "",
      medicalAllowance: "",
      bonus: "",
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
    try {
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
        bonus: userSalData.data.bonus,
        salary: userSalData.data.salary,
      });
    } catch (e) {
      console.log(e);
    }
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
      <Consumer>
        {(value) => {
          let { user } = value;
          const token = localStorage.getItem("auth-token");
          if (!token) return <Redirect to="/login" />;

          if (user && user.role === "admin") return <Redirect to="/" />;

          const {
            basicPay,
            totalLeaves,
            travelAllowance,
            medicalAllowance,
            bonus,
            salary,
          } = this.state;

          return (
            <Spring
              // from={{ opacity: 0 }}
              // to={{ opacity: 1 }}
              // config={{ duration: 300 }}
              from={{
                transform: "translate3d(1000px,0,0) ",
              }}
              to={{
                transform: "translate3d(0px,0,0) ",
              }}
              config={{ friction: 20 }}
            >
              {(props) => (
                <div className="row m-0">
                  {/* left part */}
                  <div className="col-2 p-0 leftPart">
                    <EmpSidePanel />
                  </div>

                  {/* right part */}
                  <div className="col rightPart container" style={props}>
                    <div className="row ">
                      <div className="col ">
                        {/* current salary details */}
                        <div className="mySalDetails mt-4">
                          <SalaryStructure
                            title="Salary Details"
                            basicPay={basicPay}
                            totalLeaves={totalLeaves}
                            travelAllowance={travelAllowance}
                            medicalAllowance={medicalAllowance}
                            bonus={bonus}
                            salary={salary}
                          />
                        </div>
                      </div>
                    </div>

                    {/* salary slip part */}
                    <div className="row my-3">
                      <div className="col">
                        <div className="mySalDetails">
                          <h1>Payroll History</h1>
                          <hr />
                          {/* select month */}
                          <div className="row my-4">
                            {/* dropdown col */}
                            <div className="col">
                              <div className="dropdown">
                                <button
                                  className="btn btn-primary dropdown-toggle"
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
                                        style={{ cursor: "pointer" }}
                                        key={m}
                                        className="dropdown-item btn-primary"
                                        onClick={() => this.onMonthClick(m)}
                                      >
                                        {m}
                                      </li>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>

                            {/* search button */}
                            <div className="col">
                              <input
                                type="button"
                                className="btn btn-primary btn-sm"
                                value="Search"
                                onClick={this.onFindSalReceipt}
                              />
                            </div>
                          </div>
                          {/* card */}
                          <div className="row">
                            <div className="col">
                              {this.state.salDetails ? (
                                <SalaryStructure
                                  title={`${this.state.salDetails.month}, ${this.state.salDetails.year}`}
                                  basicPay={
                                    this.state.salDetails.salDetails.basicPay
                                  }
                                  totalLeaves={
                                    this.state.salDetails.salDetails.totalLeaves
                                  }
                                  travelAllowance={
                                    this.state.salDetails.salDetails
                                      .travelAllowance
                                  }
                                  medicalAllowance={
                                    this.state.salDetails.salDetails
                                      .medicalAllowance
                                  }
                                  bonus={this.state.salDetails.salDetails.bonus}
                                  salary={
                                    this.state.salDetails.salDetails.salary
                                  }
                                />
                              ) : (
                                <h6 className="mt-3">
                                  No data available to display
                                </h6>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </Spring>
          );
        }}
      </Consumer>
    );
  }
}
