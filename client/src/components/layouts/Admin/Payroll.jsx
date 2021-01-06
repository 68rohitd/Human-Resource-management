import axios from "axios";
import React, { Component } from "react";
import SidePanel from "./SidePanel";

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

  // componentDidMount = async () => {
  //   const empSalReceipts = await axios.get("/api/admin/getAllEmpsSalReceipt");
  //   this.setState({
  //     empReceiptsList: empSalReceipts.data,
  //   });
  // };

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

    console.log("generated payslip successfully: ", res.data);
  };

  render() {
    return (
      <>
        <div className="row m-0">
          {/* left part */}
          <div className="col-2 p-0 leftPart">
            <SidePanel />
          </div>

          {/* right part */}
          <div className="col">
            <div>
              {/* select criteria */}
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
              </div>

              {this.state.selectedMonth !== "Select Month" ? (
                <>
                  <h1>
                    payroll tab for {this.state.selectedMonth} {this.curYear}
                  </h1>
                  <table className="table">
                    <thead>
                      <tr>
                        <th scope="col">#</th>
                        <th scope="col">Name</th>
                        <th scope="col">Salary</th>
                        <th scope="col">Status</th>
                        <th scope="col">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.empReceiptsList.map((emp, index) => {
                        return (
                          <tr key={index}>
                            <th scope="row">{index + 1}</th>
                            <td>{emp.empName}</td>
                            {emp[this.state.selectedMonth] ? (
                              <>
                                <td>
                                  {
                                    emp[this.state.selectedMonth].salDetails
                                      .salary
                                  }
                                </td>
                                <td>Generated</td>
                              </>
                            ) : (
                              <>
                                <td>{emp.currentSalary}</td>
                                <td>Pending</td>
                                <td>
                                  <input
                                    type="button"
                                    className="btn btn-primary"
                                    value="generate sal"
                                    onClick={() =>
                                      this.onGenerateSalReceipt(emp)
                                    }
                                  />
                                </td>
                              </>
                            )}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </>
              ) : null}
            </div>
          </div>
        </div>
      </>
    );
  }
}
