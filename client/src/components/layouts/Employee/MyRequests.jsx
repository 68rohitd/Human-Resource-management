import axios from "axios";
import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import { Consumer } from "../../../context";
import EmpSidePanel from "./EmpSidePanel";
import empty from "../../../assets/images/empty.png";
import { Spring } from "react-spring/renderprops";
import ReactTooltip from "react-tooltip";

export default class MyRequests extends Component {
  constructor() {
    super();

    this.state = {
      user: {},
      leaveRequests: [],
      openedLeavesTickets: [],
      closedLeavesTickets: [],

      loanRequests: [],
      openedLoanTickets: [],
      closedLoanTickets: [],

      bonusRequests: [],
      openedBonusTickets: [],
      closedBonusTickets: [],

      listToShow: [],

      // choose
      selectedLabel: "Leave Requests",
      selectedFilter: "All",
    };
  }

  onGetDate = (date) => {
    const d = new Date(date);
    let returnDate = d.toLocaleDateString("en-GB");
    return returnDate;
  };

  componentDidMount = async () => {
    const token = localStorage.getItem("auth-token");
    const userRes = await axios.get("/api/users", {
      headers: { "x-auth-token": token },
    });

    console.log(userRes.data.user);

    this.setState(
      {
        user: userRes.data.user,
      },
      () => {
        this.filterLists();
      }
    );
  };

  filterLists = () => {
    let leaveRequests = [];
    let openedLeavesTickets = [];
    let closedLeavesTickets = [];

    let loanRequests = [];
    let openedLoanTickets = [];
    let closedLoanTickets = [];

    let bonusRequests = [];
    let openedBonusTickets = [];
    let closedBonusTickets = [];

    this.state.user.notification.forEach((item) => {
      if (item.title === "leave request") {
        leaveRequests.push(item);
        if (item.ticketClosed) closedLeavesTickets.push(item);
        else openedLeavesTickets.push(item);
      } else if (item.title === "loan request") {
        loanRequests.push(item);
        if (item.ticketClosed) closedLoanTickets.push(item);
        else openedLoanTickets.push(item);
      } else {
        bonusRequests.push(item);
        if (item.ticketClosed) closedBonusTickets.push(item);
        else openedBonusTickets.push(item);
      }
    });
    leaveRequests = leaveRequests.reverse();
    loanRequests = loanRequests.reverse();
    bonusRequests = bonusRequests.reverse();
    openedLeavesTickets = openedLeavesTickets.reverse();
    closedLeavesTickets = closedLeavesTickets.reverse();
    openedBonusTickets = openedBonusTickets.reverse();
    closedBonusTickets = closedBonusTickets.reverse();
    openedLoanTickets = openedLoanTickets.reverse();
    closedLoanTickets = closedLoanTickets.reverse();

    this.setState({
      leaveRequests,
      loanRequests,
      bonusRequests,
      openedLeavesTickets,
      closedLeavesTickets,
      openedBonusTickets,
      closedBonusTickets,
      openedLoanTickets,
      closedLoanTickets,
      listToShow: leaveRequests,
    });
  };

  onSelectLabel = (selectedLabel) => {
    this.setState(
      {
        selectedLabel,
      },
      () => {
        this.onSelectFilter(this.state.selectedFilter);
      }
    );
  };

  onSelectFilter = (selectedFilter) => {
    const { selectedLabel } = this.state;
    let listToShow = [];

    if (selectedLabel === "Leave Requests") {
      if (selectedFilter === "All") {
        listToShow = this.state.leaveRequests;
      } else if (selectedFilter === "Pending") {
        listToShow = this.state.openedLeavesTickets;
      } else {
        listToShow = this.state.closedLeavesTickets;
      }
    } else if (selectedLabel === "Bonus Requests") {
      if (selectedFilter === "All") {
        listToShow = this.state.bonusRequests;
      } else if (selectedFilter === "Pending") {
        listToShow = this.state.openedBonusTickets;
      } else {
        listToShow = this.state.closedBonusTickets;
      }
    } else {
      if (selectedFilter === "All") {
        listToShow = this.state.loanRequests;
      } else if (selectedFilter === "Pending") {
        listToShow = this.state.openedLoanTickets;
      } else {
        listToShow = this.state.closedLoanTickets;
      }
    }

    this.setState({
      selectedFilter,
      listToShow,
    });
  };

  render() {
    return (
      <Consumer>
        {(value) => {
          let { user } = value;
          const token = localStorage.getItem("auth-token");
          if (!token) return <Redirect to="/login" />;

          if (user && user.role === "admin") return <Redirect to="/" />;

          return (
            <Spring
              from={{ opacity: 0 }}
              to={{ opacity: 1 }}
              config={{ duration: 300 }}
            >
              {(props) => (
                <div className="row m-0">
                  {/* left part */}
                  <div className="col-2 p-0 leftPart">
                    <EmpSidePanel />
                  </div>

                  {/* right part */}
                  <div className="col rightPart" style={props}>
                    <div className="container pl-5 pt-3">
                      <div className="row">
                        <div className="col">
                          <h2>My Requests</h2>
                        </div>

                        <div className="col text-right">
                          {/* choose buttons */}
                          <div className="row">
                            <div className="col">
                              <div
                                className="btn-group btn-group-toggle"
                                data-toggle="buttons"
                              >
                                <label className="btn btn-primary active">
                                  <input
                                    type="radio"
                                    name="options"
                                    id="option1"
                                    defaultChecked={true}
                                    onClick={() =>
                                      this.onSelectLabel("Leave Requests")
                                    }
                                  />
                                  Leave Requests
                                </label>
                                <label className="btn btn-primary">
                                  <input
                                    type="radio"
                                    name="options"
                                    id="option2"
                                    onClick={() =>
                                      this.onSelectLabel("Bonus Requests")
                                    }
                                  />
                                  Bonus Requests
                                </label>
                                <label className="btn btn-primary">
                                  <input
                                    type="radio"
                                    name="options"
                                    id="option3"
                                    onClick={() =>
                                      this.onSelectLabel("Loan Requests")
                                    }
                                  />
                                  Loan Requests
                                </label>
                              </div>
                            </div>
                          </div>

                          {/* choose filter */}
                          <div className="row mt-3">
                            <div className="col">
                              <div
                                className="btn-group btn-group-toggle"
                                data-toggle="buttons"
                              >
                                <label className="btn btn-primary active">
                                  <input
                                    type="radio"
                                    name="options"
                                    id="option1"
                                    defaultChecked={true}
                                    onClick={() => this.onSelectFilter("All")}
                                  />
                                  All
                                </label>
                                <label className="btn btn-primary">
                                  <input
                                    type="radio"
                                    name="options"
                                    id="option2"
                                    onClick={() =>
                                      this.onSelectFilter("Pending")
                                    }
                                  />
                                  Pending
                                </label>
                                <label className="btn btn-primary">
                                  <input
                                    type="radio"
                                    name="options"
                                    id="option3"
                                    onClick={() =>
                                      this.onSelectFilter("Closed")
                                    }
                                  />
                                  Closed
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <hr />

                      {/* leave request */}
                      {this.state.selectedLabel === "Leave Requests" ? (
                        <div className="row p-0">
                          <div className="col">
                            <h5>Leave Requests</h5>

                            {this.state.listToShow.length ? (
                              <table className="table table-hover ">
                                <thead className="thead-light">
                                  <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Subject</th>
                                    <th scope="col">Created On</th>
                                    <th scope="col">Status</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {this.state.listToShow.map((req, index) => {
                                    return (
                                      <tr key={index}>
                                        <th scope="row">{index + 1}</th>
                                        <td>
                                          <Link
                                            style={{ textDecoration: "none" }}
                                            to={`/viewSingleRequest/${req.title}/${req.reqId}`}
                                          >
                                            {req.subject}
                                          </Link>
                                        </td>
                                        <td>{this.onGetDate(req.date)}</td>
                                        {req.ticketClosed ? (
                                          <td>Closed</td>
                                        ) : (
                                          <td>Pending</td>
                                        )}
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            ) : (
                              <div className="text-center text-secondary">
                                <img src={empty} alt="" width="400px" />
                                <h1>No tickets</h1>
                              </div>
                            )}
                          </div>
                        </div>
                      ) : null}

                      {/* bonus request */}
                      {this.state.selectedLabel === "Bonus Requests" ? (
                        <div className="row">
                          <div className="col">
                            <h5>Bonus Requests</h5>

                            {this.state.listToShow.length ? (
                              <table className="table table-hover">
                                <thead className="thead-light">
                                  <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Subject</th>
                                    <th scope="col">Created On</th>
                                    <th scope="col">Status</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {this.state.listToShow.map((req, index) => {
                                    return (
                                      <tr key={index}>
                                        <th scope="row">{index + 1}</th>
                                        <td>
                                          <Link
                                            style={{ textDecoration: "none" }}
                                            to={`/viewSingleRequest/${req.title}/${req.reqId}`}
                                          >
                                            {req.bonusReason}
                                          </Link>
                                        </td>
                                        <td>{this.onGetDate(req.date)}</td>
                                        {req.ticketClosed ? (
                                          <td>Closed</td>
                                        ) : (
                                          <td>Pending</td>
                                        )}
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            ) : (
                              <div className="text-center text-secondary">
                                <img src={empty} alt="" width="400px" />
                                <h1>No tickets</h1>
                              </div>
                            )}
                          </div>
                        </div>
                      ) : null}

                      {/* Loan requests */}
                      {this.state.selectedLabel === "Loan Requests" ? (
                        <div className="row">
                          <div className="col">
                            <h5>Loan Requests</h5>

                            {this.state.listToShow.length ? (
                              <table className="table table-hover">
                                <thead className="thead-light">
                                  <ReactTooltip
                                    place="bottom"
                                    delayShow={100}
                                    html={true}
                                  />
                                  <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Subject</th>
                                    <th scope="col">Created On</th>
                                    <th scope="col">Ticket Status</th>
                                    <th scope="col">
                                      Loan Status{" "}
                                      <i
                                        className="fas fa-info-circle text-secondary"
                                        data-tip="Paid / Unpaid / Rejected"
                                      ></i>{" "}
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {this.state.listToShow.map((req, index) => {
                                    return (
                                      <tr key={index}>
                                        <th scope="row">{index + 1}</th>
                                        <td>
                                          <Link
                                            style={{ textDecoration: "none" }}
                                            to={`/viewSingleRequest/${req.title}/${req.reqId}`}
                                          >
                                            {req.loanReason}
                                          </Link>
                                        </td>
                                        <td>{this.onGetDate(req.date)}</td>
                                        {req.ticketClosed ? (
                                          <td>Closed</td>
                                        ) : (
                                          <td>Pending</td>
                                        )}
                                        {req.ticketClosed ? (
                                          req.approved ? (
                                            req.loanRepaid ? (
                                              <td>Paid</td>
                                            ) : (
                                              <td>Pending</td>
                                            )
                                          ) : (
                                            <td>Loan Rejected</td>
                                          )
                                        ) : (
                                          <td>Pending</td>
                                        )}
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            ) : (
                              <div className="text-center text-secondary">
                                <img src={empty} alt="" width="400px" />
                                <h1>No tickets</h1>
                              </div>
                            )}
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              )}
            </Spring>
          );
        }}
      </Consumer>
    );
  }
}
