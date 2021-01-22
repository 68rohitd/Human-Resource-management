import axios from "axios";
import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import { Spring } from "react-spring/renderprops";
import { Consumer } from "../../../context";
import AdminSidePanel from "./AdminSidePanel";
import empty from "../../../assets/images/empty.png";

export default class ActiveLoans extends Component {
  constructor() {
    super();

    this.state = {
      activeLoanList: [],
    };
  }

  componentDidMount = async () => {
    const loanList = await axios.get("/api/admin/getLoanList");
    let activeLoanList = loanList.data.filter(
      (loan) => loan.loanRepaid === false
    );
    this.setState({ activeLoanList });
    console.log("loan list: ", activeLoanList);
  };

  onGetDate = (date) => {
    const d = new Date(date);
    let returnDate = d.toLocaleDateString("en-GB");
    return returnDate;
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
                    <AdminSidePanel />
                  </div>

                  {/* right part */}
                  <div className="col mt-3" style={props}>
                    {this.state.activeLoanList.length ? (
                      <table className="table table-hover">
                        <thead className="thead-light">
                          <tr>
                            <th scope="col">#</th>
                            <th scope="col">Name</th>
                            <th scope="col">Subject</th>
                            <th scope="col">Created On</th>
                            <th scope="col">Time Period</th>
                          </tr>
                        </thead>
                        <tbody>
                          {this.state.activeLoanList.map((loan, index) => {
                            return (
                              <tr key={index}>
                                <th scope="row">{index + 1}</th>
                                <td>
                                  <Link
                                    to={`/editEmpProfile/${loan.empId}`}
                                    style={{ textDecoration: "none" }}
                                  >
                                    {loan.empName}
                                  </Link>
                                </td>
                                <td>
                                  <Link
                                    style={{ textDecoration: "none" }}
                                    to={`/viewSingleRequest/${loan.title}/${loan.reqId}`}
                                  >
                                    {loan.loanReason}
                                  </Link>
                                </td>
                                <td>{this.onGetDate(loan.date)}</td>
                                <td>{loan.timePeriod} month(s)</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    ) : (
                      <div className="text-center text-secondary mt-5">
                        <img src={empty} alt="" width="400px" />
                        <h1>No active loans</h1>
                      </div>
                    )}
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
