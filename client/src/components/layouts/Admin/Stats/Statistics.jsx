import axios from "axios";
import React, { Component } from "react";
import PieChart from "./PieChart";
import BarChart from "./BarChart";
import LineChart from "./LineChart";
import SidePanel from "../SidePanel";
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
      <div className="row">
        {/* left part */}
        <div className="col-3">
          <SidePanel />
        </div>

        {/* right part */}
        <div className="col">
          <div>
            <h1>stats</h1>
            <div className="container">
              <h1>emp count: {this.state.empList.length}</h1>
              <h1>total expenses: ₹{this.state.totalExpenses}</h1>
            </div>

            <div className="container">
              <PieChart />
            </div>

            <div className="container">
              <BarChart />
            </div>

            <div className="container">
              <LineChart />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
