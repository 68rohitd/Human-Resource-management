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
          backgroundColor: ["#993299", "lightgreen"],
          hoverBackgroundColor: ["#800080", "#329932"],
          data: [],
        },
      ],
    };
  }

  componentDidMount = async () => {
    const empList = await axios.get("/api/admin/getEmpList");
    this.setState({ empList: empList.data }, () => {
      this.onFilterGender();
    });
  };

  onFilterGender = () => {
    let maleCount = 0;
    let femaleCount = 0;
    this.state.empList.forEach((emp) => {
      if (emp.gender === "male") maleCount = parseInt(maleCount) + 1;
      else femaleCount = parseInt(femaleCount) + 1;
    });

    let datasets = [...this.state.datasets];
    datasets[0].data = [maleCount, femaleCount];

    this.setState({ datasets });
  };

  render() {
    return (
      <div>
        <Pie
          data={this.state}
          options={{
            title: {
              display: true,
              text: "male to female ratio",
              fontSize: 20,
            },
            legend: {
              display: true,
              position: "right",
            },
          }}
        />
      </div>
    );
  }
}
