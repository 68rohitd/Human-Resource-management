import axios from "axios";
import React, { Component } from "react";
import PieChart from "./PieChart";
import BarChart from "./BarChart";
import LineChart from "./LineChart";
import SidePanel from "../SidePanel";
import "../../../../assets/stats-styles/stats.css";
import Card from "./Card";
export default class Statistics extends Component {
  constructor() {
    super();

    this.state = {
      empList: [],
      empSalList: [],
      totalExpenses: 0,
    };
  }

  componentDidMount = async () => {
    const empList = await axios.get("/api/admin/getEmpList");
    const empSalList = await axios.get("/api/admin/getEmpSalList");
    this.setState(
      { empList: empList.data, empSalList: empSalList.data },
      () => {
        this.calTotalExpenses();
      }
    );
  };

  calTotalExpenses = () => {
    let totalExpenses = 0;
    this.state.empSalList.forEach((emp) => {
      totalExpenses += parseInt(emp.salary);
    });

    this.setState({ totalExpenses });
  };

  render() {
    return (
      <div className="row m-0">
        {/* left part */}
        <div className="col-2 p-0 leftPart">
          <SidePanel />
        </div>

        {/* right part */}
        <div className="col-9 rightPart container">
          {/* numbers */}
          <div className="row mt-5">
            <div className="col-4 mr-3 ">
              <Card
                label="Total Expenses"
                data={`₹ ${this.state.totalExpenses}`}
              />
            </div>
            <div className="col-4">
              <Card label="Employee Count" data={this.state.empList.length} />
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
  }
}
