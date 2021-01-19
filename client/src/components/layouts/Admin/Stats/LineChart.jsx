import axios from "axios";
import React, { Component } from "react";
import { Line } from "react-chartjs-2";

export default class LineChart extends Component {
  constructor() {
    super();
    this.state = {
      empList: [],

      labels: [], //x axis
      datasets: [
        {
          label: "Hired",
          fill: false,
          lineTension: 0.5,
          backgroundColor: "white",
          borderColor: "#02C39A",
          borderWidth: 2,
          data: [], //y axis
        },
      ],
    };
  }

  componentDidMount = async () => {
    axios.get("/api/admin/getEmpList").then((empList) => {
      this.setState({ empList: empList.data }, () => {
        this.onPopulateLineChart();
      });
    });
  };

  onPopulateLineChart = () => {
    let empCountDict = {};

    this.state.empList.forEach((emp) => {
      const d = new Date(emp.doj);
      if (!empCountDict[d.getFullYear()]) {
        empCountDict[d.getFullYear()] = 1;
      } else {
        empCountDict[d.getFullYear()]++;
      }
    });

    console.log("emp count year wise", empCountDict);

    let datasets = this.state.datasets;
    let labels = [];
    let data = [];

    for (const property in empCountDict) {
      labels.push(property);
      data.push(empCountDict[property]);
    }

    datasets[0].data = data;

    this.setState({ datasets, labels });
  };

  render() {
    return (
      <div
        className="chartContainer"
        style={{ height: "250px", padding: "10px" }}
      >
        <Line
          data={this.state}
          options={{
            scales: {
              yAxes: [
                {
                  ticks: {
                    beginAtZero: true,
                  },
                },
              ],
            },
            title: {
              display: true,
              text: "No. of Employees hired",
              position: "bottom",
              fontSize: 20,
            },
            legend: {
              display: true,
              position: "right",
            },
            maintainAspectRatio: false,
          }}
        />
      </div>
    );
  }
}
