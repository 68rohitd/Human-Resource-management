import axios from "axios";
import React, { Component } from "react";
import AdminSidePanel from "./AdminSidePanel";
import "../../../assets/payroll/payroll.css";
import emptyImg from "../../../assets/payroll/empty.png";
import { Link, Redirect } from "react-router-dom";
import toast from "toasted-notes";
import "toasted-notes/src/styles.css";
import { Consumer } from "../../../context";
import ReactTooltip from "react-tooltip";
import { Spring } from "react-spring/renderprops";

export default class Payroll extends Component {
  constructor() {
    super();

    this.state = {
      selectedMonth: "Select Month",
      empReceiptsList: [],
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

  onMonthClick = async (month) => {
    const empSalReceipts = await axios.get("/api/admin/getAllEmpsSalReceipt");
    console.log(empSalReceipts.data);
    let monthlyData = [];

    empSalReceipts.data.forEach((emp) => {
      let eachEmp = {
        currentSalary: emp.currentSalary,
        empId: emp.empId,
      };
      eachEmp["empName"] = emp.empName;
      emp.monthlyReceipts.forEach((m) => {
        eachEmp[m.month] = m;
      });
      monthlyData.push(eachEmp);
    });

    this.setState({
      selectedMonth: month,
      empReceiptsList: monthlyData,
    });
  };

  onCheckReceiptGenerated = (monthlyReceipts) => {
    for (let i = 0; i < monthlyReceipts.length; i++) {
      let curMonth = monthlyReceipts[i];
      if (curMonth.month === this.state.selectedMonth) return true;
    }
    return false;
  };

  onGenerateSalReceipt = async (emp) => {
    try {
      // 1. get sal details
      const salDetails = await axios.get(
        `/api/admin/getUserSalDetails/${emp.empId}`
      );
      const res = await axios.put("/api/admin/generateSalReceipt", {
        empId: emp.empId,
        month: this.state.selectedMonth,
        year: this.curYear,
        salDetails: salDetails.data,
      });

      const updatedEmpReceiptDoc = res.data.updatedEmpReceiptDoc;

      let empReceiptsList = this.state.empReceiptsList;
      empReceiptsList.forEach((emp) => {
        if (emp.empId === updatedEmpReceiptDoc.empId) {
          const newReceipt =
            updatedEmpReceiptDoc.monthlyReceipts[
              updatedEmpReceiptDoc.monthlyReceipts.length - 1
            ];

          empReceiptsList.forEach((stateEmp) => {
            if (stateEmp.empId === emp.empId) {
              stateEmp[this.state.selectedMonth] = newReceipt;
            }
          });
        }
      });

      this.setState({ empReceiptsList });

      toast.notify("Salary Receipt generated successfully", {
        position: "top-right",
      });

      console.log("generated payslip successfully: ", res.data);
    } catch (e) {
      console.log(e);
    }
  };

  render() {
    return (
      <Consumer>
        {(value) => {
          let { user } = value;

          const token = localStorage.getItem("auth-token");

          if (!token) return <Redirect to="/login" />;
          if (user && user.role !== "admin")
            return <Redirect to="/empDashBoard" />;
          return (
            <Spring
              from={{ opacity: 0 }}
              to={{ opacity: 1 }}
              config={{ duration: 300 }}
            >
              {(props) => (
                <>
                  <div className="row m-0">
                    {/* left part */}
                    <div className="col-2 p-0 leftPart">
                      <AdminSidePanel />
                    </div>

                    {/* right part */}
                    <div className="col mt-3" style={props}>
                      <div className="container">
                        {/* select month */}
                        <div className="dropdown" style={{ float: "left" }}>
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

                        {this.state.selectedMonth !== "Select Month" ? (
                          <>
                            <h1 className="my-3 text-right text-secondary">
                              Payroll table for {this.state.selectedMonth},{" "}
                              {this.curYear}
                            </h1>

                            <ReactTooltip
                              place="bottom"
                              delayShow={100}
                              html={true}
                            />

                            <table className="table table-hover table-border text-center">
                              <thead>
                                <tr>
                                  <th scope="col">#</th>
                                  <th scope="col">Name</th>
                                  <th scope="col">Salary</th>
                                  <th scope="col">Status</th>
                                  <th scope="col">
                                    Action{" "}
                                    <i
                                      className="fas fa-info-circle text-secondary"
                                      data-tip="Once salary slip is generated, <br /> bonus, total leaves of that employee will be cleared"
                                    ></i>{" "}
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {this.state.empReceiptsList.map(
                                  (emp, index) => {
                                    return (
                                      <tr key={index}>
                                        <th scope="row">{index + 1}</th>
                                        <td>{emp.empName}</td>
                                        {emp[this.state.selectedMonth] ? (
                                          <>
                                            <td>
                                              {
                                                emp[this.state.selectedMonth]
                                                  .salDetails.salary
                                              }
                                            </td>
                                            <td>Generated</td>
                                            <td>
                                              <input
                                                type="button"
                                                className="btn btn-success"
                                                value="Receipt Generated"
                                                disabled={true}
                                              />
                                            </td>
                                          </>
                                        ) : (
                                          <>
                                            <td>{emp.currentSalary}</td>
                                            <td>Pending</td>
                                            <td>
                                              <div className="dropdown">
                                                <button
                                                  className="btn btn-primary dropdown-toggle"
                                                  type="button"
                                                  id="dropdownMenuButton"
                                                  data-toggle="dropdown"
                                                  aria-haspopup="true"
                                                  aria-expanded="false"
                                                >
                                                  Take action
                                                </button>
                                                <div
                                                  className="dropdown-menu"
                                                  aria-labelledby="dropdownMenuButton"
                                                >
                                                  <li
                                                    style={{
                                                      cursor: "pointer",
                                                    }}
                                                    className="dropdown-item btn-primary"
                                                    onClick={() =>
                                                      this.onGenerateSalReceipt(
                                                        emp
                                                      )
                                                    }
                                                  >
                                                    Generate Receipt
                                                  </li>
                                                  <Link
                                                    to={`/editEmpProfile/${emp.empId}`}
                                                    style={{
                                                      textDecoration: "none",
                                                    }}
                                                  >
                                                    <li className="dropdown-item">
                                                      View profile/Edit salary
                                                      details
                                                    </li>
                                                  </Link>
                                                </div>
                                              </div>
                                            </td>
                                          </>
                                        )}
                                      </tr>
                                    );
                                  }
                                )}
                              </tbody>
                            </table>
                          </>
                        ) : (
                          <>
                            <h2 className="text-center mt-3 emptyPicText text-secondary">
                              <b>Select month to view details</b>
                            </h2>
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "center",
                              }}
                            >
                              <img
                                className="emptyPic"
                                src={emptyImg}
                                alt="login.svg"
                              />
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </Spring>
          );
        }}
      </Consumer>
    );
  }
}
