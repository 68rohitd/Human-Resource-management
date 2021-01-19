import axios from "axios";
import React, { Component } from "react";
import { Pie } from "react-chartjs-2";

export default class PieChart extends Component {
  constructor() {
    super();

    this.state = {
      empList: [],

      // pie chart
      labels: ["Male", "Female"],
      datasets: [
        {
          label: "Gender",
          backgroundColor: ["#cbb4ca", "#A8DCD9"],
          borderColor: "white",
          data: [],
        },
      ],
    };
  }

  componentDidMount = async () => {
    axios.get("/api/admin/getEmpList").then((empList) => {
      this.setState({ empList: empList.data }, () => {
        this.onFilterGender();
      });
    });
  };

  onFilterGender = () => {
    let maleCount = 0;
    let femaleCount = 0;
    this.state.empList.forEach((emp) => {
      if (emp.gender === "Male") maleCount = parseInt(maleCount) + 1;
      else femaleCount = parseInt(femaleCount) + 1;
    });

    let datasets = [...this.state.datasets];
    datasets[0].data = [maleCount, femaleCount];

    this.setState({ datasets });
  };

  render() {
    return (
      <div
        className="chartContainer"
        style={{ height: "250px", padding: "10px" }}
      >
        <Pie
          data={this.state}
          options={{
            title: {
              display: true,
              text: "Male to Female ratio",
              fontSize: 20,
              position: "bottom",
            },
            legend: {
              display: true,
              position: "left",
            },
            maintainAspectRatio: false,
          }}
        />
      </div>
    );
  }
}
