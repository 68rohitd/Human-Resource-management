import axios from "axios";
import React, { Component } from "react";

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

  componentDidMount = async () => {
    const empSalReceipts = await axios.get("/api/admin/getEmpSalReceipts");
    console.log(empSalReceipts.data);
    this.setState({
      empReceiptsList: empSalReceipts.data,
    });
  };

  onMonthClick = (month) => {
    this.setState({
      selectedMonth: month,
    });
  };

  onCheckReceiptGenerated = (monthlyReceipts) => {
    console.log(monthlyReceipts);

    for (let i = 0; i < monthlyReceipts.length; i++) {
      let curMonth = monthlyReceipts[i];
      if (curMonth.month === this.state.selectedMonth) return true;
    }
    return false;
  };

  onGenerateSalReceipt = async (emp) => {
    console.log(emp);
    const res = await axios.put("/api/admin/generateSalReceipt", {
      empId: emp.empId,
      month: this.state.selectedMonth,
      year: this.curYear,
    });

    console.log("updates emp sal reciept", res.data);
  };

  render() {
    return (
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
            <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
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
          <h1>
            payroll tab for {this.state.selectedMonth} {this.curYear}{" "}
          </h1>
        ) : null}
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
                  <td>{emp.currentSalary}</td>
                  {this.onCheckReceiptGenerated(emp.monthlyReceipts) ? (
                    <td>Generated</td>
                  ) : (
                    <>
                      <td>Pending</td>
                      <td>
                        <input
                          type="button"
                          className="btn btn-primary"
                          value="generate sal"
                          onClick={() => this.onGenerateSalReceipt(emp)}
                        />
                      </td>
                    </>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
}
