import axios from "axios";
import React, { Component } from "react";
import { Bar } from "react-chartjs-2";

export default class BarChart extends Component {
  constructor() {
    super();

    this.state = {
      empList: [],
      labels: [],
      datasets: [
        {
          label: "emp count",
          backgroundColor: "#b3d1ff",
          borderColor: "#0066ff",
          borderWidth: 2,
          data: [],
        },
      ],
    };
  }

  componentDidMount = async () => {
    axios.get("/api/admin/getEmpList").then((empList) => {
      this.setState({ empList: empList.data }, () => {
        this.onPopulateBarChart();
      });
    });
  };

  onPopulateBarChart = () => {
    //   no of emp per team
    let teamDict = {};

    this.state.empList.forEach((emp) => {
      if (!teamDict[emp.team]) {
        teamDict[emp.team] = 1;
      } else {
        teamDict[emp.team]++;
      }
    });

    console.log("taem dict: ", teamDict);

    let datasets = this.state.datasets;
    let labels = [];
    let data = [];

    for (const property in teamDict) {
      labels.push(property);
      data.push(teamDict[property]);
    }

    console.log(data);

    datasets[0].data = data;

    this.setState({ datasets, labels });
  };

  render() {
    return (
      <div
        className="chartContainer"
        style={{ height: "250px", padding: "10px" }}
      >
        <Bar
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
              text: "No. of employees per team",
              fontSize: 20,
              position: "bottom",
            },
            maintainAspectRatio: false,
          }}
        />
      </div>
    );
  }
}
