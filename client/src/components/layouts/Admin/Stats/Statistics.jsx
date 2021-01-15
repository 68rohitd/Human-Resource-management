import axios from "axios";
import React, { Component } from "react";
import PieChart from "./PieChart";
import BarChart from "./BarChart";
import LineChart from "./LineChart";
import AdminSidePanel from "../AdminSidePanel";
import "../../../../assets/stats-styles/stats.css";
import Card from "./Card";
import { Consumer } from "../../../../context";
import { Redirect } from "react-router-dom";
export default class Statistics extends Component {
  constructor() {
    super();

    this.state = {
      empList: [],
      empSalList: [],
      loanList: [],
      totalExpenses: 0,
      loanExpenses: 0,
    };
  }

  componentDidMount = async () => {
    const empList = await axios.get("/api/admin/getEmpList");
    const empSalList = await axios.get("/api/admin/getEmpSalList");
    const loanList = await axios.get("/api/admin/getLoanList");

    this.setState(
      {
        empList: empList.data,
        empSalList: empSalList.data,
        loanList: loanList.data,
      },
      () => {
        this.calTotalExpenses();
        this.calLoanExpenses();
      }
    );
  };

  calLoanExpenses = () => {
    let totalLoan = 0;

    console.log("emp loan list: ", this.state.loanList);

    this.state.loanList.forEach((loan) => {
      if (!loan.loanRepaid) totalLoan += parseInt(loan.amount);
    });

    this.setState({ loanExpenses: totalLoan });
  };

  calTotalExpenses = () => {
    let totalExpenses = 0;
    console.log("emp sal list: ", this.state.empSalList);
    this.state.empSalList.forEach((emp) => {
      totalExpenses += parseInt(emp.salary);
    });

    this.setState({ totalExpenses });
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

          //added this condition coz it was showing admin panel till emp data was loaded
          if (user && user.role === "admin")
            return (
              <div className="row m-0">
                {/* left part */}
                <div className="col-2 p-0 leftPart">
                  <AdminSidePanel />
                </div>

                {/* right part */}
                <div className="col-9 rightPart container">
                  {/* numbers */}
                  <div className="row mt-5">
                    <div className="col ">
                      <Card
                        label="Salary Expenses"
                        data={`₹ ${this.state.totalExpenses}`}
                      />
                    </div>
                    <div className="col ">
                      <Card
                        label="Loan Expenses"
                        data={`₹ ${this.state.loanExpenses}`}
                      />
                    </div>
                    <div className="col">
                      <Card
                        label="Employee Count"
                        data={this.state.empList.length}
                      />
                    </div>
                  </div>

                  {/* charts */}
                  <div className="row mt-5">
                    <div className="col my-4">
                      <PieChart />
                    </div>

                    <div className="col my-4">
                      <BarChart />
                    </div>
                  </div>

                  <div className="row mt-4">
                    <div className="col my-4">
                      <LineChart />
                    </div>
                  </div>
                </div>
              </div>
            );
        }}
      </Consumer>
    );
  }
}
