import axios from "axios";
import React, { Component } from "react";
import { Bar } from "react-chartjs-2";

export default class BarChart2 extends Component {
  constructor() {
    super();

    this.state = {
      // for chart
      leaveReqCount: 0,
      bonusReqCount: 0,
      loanReqCount: 0,

      labels: ["Leave Request", "Bonus Request", "Loan Request"],
      datasets: [
        {
          label: "Request count",
          backgroundColor: "#ffe0b3",
          borderColor: "orange",
          borderWidth: 2,
          data: [],
        },
      ],
    };
  }

  componentDidMount = async () => {
    const token = localStorage.getItem("auth-token");
    const adminRes = await axios.get("/api/admin", {
      headers: { "x-auth-token": token },
    });

    let leaveReqCount = adminRes.data.user.leaveRequests.length;
    let bonusReqCount = adminRes.data.user.bonusRequests.length;
    let loanReqCount = adminRes.data.user.loanRequests.length;

    this.setState(
      {
        leaveReqCount,
        bonusReqCount,
        loanReqCount,
      },
      () => {
        this.onPopulateBarChart();
      }
    );
  };

  onPopulateBarChart = () => {
    let datasets = this.state.datasets;
    let data = [
      this.state.leaveReqCount,
      this.state.bonusReqCount,
      this.state.loanReqCount,
    ];

    datasets[0].data = data;

    this.setState({ datasets });
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
              text: "No. of requests per subject",
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
