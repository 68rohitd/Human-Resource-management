import axios from "axios";
import React, { Component } from "react";
import { Bar } from "react-chartjs-2";

export default class PieChart extends Component {
  constructor() {
    super();

    this.state = {
      empList: [],
      labels: [],
      datasets: [
        {
          label: "emp count",
          //   backgroundColor: "rgba(75,192,192,1)",
          borderColor: "rgba(0,0,0,1)",
          borderWidth: 2,
          data: [],
        },
      ],
    };
  }

  componentDidMount = async () => {
    const empList = await axios.get("/api/admin/getEmpList");
    this.setState({ empList: empList.data }, () => {
      this.onPopulateBarChart();
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
      <div>
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
              text: "no of emp per team",
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
