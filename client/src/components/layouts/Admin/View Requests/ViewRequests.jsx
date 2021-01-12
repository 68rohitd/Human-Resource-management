import axios from "axios";
import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { Consumer } from "../../../../context";
import AdminSidePanel from "../AdminSidePanel";
import BonusRequestCard from "./BonusRequestCard";
import LeaveRequestCard from "./LeaveRequestCard";
import LoanRequestCard from "./LoanRequestCard";

export default class ViewRequests extends Component {
  constructor() {
    super();

    this.state = {
      admin: undefined,
    };
  }

  componentDidMount = async () => {
    try {
      const token = localStorage.getItem("auth-token");
      const tokenRes = await axios.post("/api/admin/tokenIsValid", null, {
        headers: { "x-auth-token": token },
      });

      if (tokenRes.data) {
        //logged in
        const adminRes = await axios.get("/api/admin", {
          headers: { "x-auth-token": token },
        });
        console.log("admin profile: ", adminRes.data.user);
        this.setState({
          admin: adminRes.data.user,
        });
      }
    } catch (e) {
      console.log(e);
    }
  };

  callDispatch = (dispatch, req) => {
    switch (req.title) {
      case "leave request":
        let leaveUser = this.state.admin;
        leaveUser.leaveRequests = leaveUser.leaveRequests.filter(
          (eachReq) => eachReq.reqId !== req.reqId
        );

        this.setState({
          admin: leaveUser,
        });

        dispatch({
          type: "APPROVED_REJECTED_LEAVE",
          payload: {
            reqId: req.reqId,
          },
        });
        break;

      case "bonus request":
        let bonusUser = this.state.admin;
        bonusUser.bonusRequests = bonusUser.bonusRequests.filter(
          (eachReq) => eachReq.reqId !== req.reqId
        );

        this.setState({
          admin: bonusUser,
        });
        dispatch({
          type: "APPROVED_REJECTED_BONUS",
          payload: {
            reqId: req.reqId,
          },
        });
        break;

      case "loan request":
        let loanUser = this.state.admin;
        loanUser.loanRequests = loanUser.loanRequests.filter(
          (eachReq) => eachReq.reqId !== req.reqId
        );

        this.setState({
          admin: loanUser,
        });
        dispatch({
          type: "APPROVED_REJECTED_LOAN",
          payload: {
            reqId: req.reqId,
          },
        });
        break;

      default:
        return;
    }
  };

  onApprove = async (req, dispatch) => {
    this.callDispatch(dispatch, req);

    console.log("approving: ", req);

    req.approved = true;
    req.ticketClosed = true;

    try {
      const adminId = localStorage.getItem("userId");
      const res = await axios.put("/api/admin/takeAction", {
        userReq: req,
        adminId: adminId,
      });
      console.log("approved successfully", res.data);
    } catch (e) {
      console.log("Error: ", e.response.data.msg);
    }
  };

  onReject = async (req, dispatch) => {
    this.callDispatch(dispatch, req);

    console.log("rejecting: ", req);

    req.approved = false;
    req.ticketClosed = true;

    try {
      const adminId = localStorage.getItem("userId");
      const res = await axios.put("/api/admin/takeAction", {
        userReq: req,
        adminId: adminId,
      });
      console.log("rejected successfully: ", res.data);
    } catch (e) {
      console.log("Error: ", e.response);
    }
  };

  render() {
    return (
      <Consumer>
        {(value) => {
          let { admin } = this.state;

          let { user } = value;

          const token = localStorage.getItem("auth-token");

          if (!token) return <Redirect to="/login" />;
          if (user && user.role !== "admin")
            return <Redirect to="/empDashBoard" />;

          return (
            <>
              <div className="row m-0">
                {/* left part */}
                <div className="col-2 p-0 leftPart">
                  <AdminSidePanel />
                </div>

                {/* right part */}
                <div className="col">
                  <div className="container">
                    <h1>Leave Requests</h1>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                      }}
                    >
                      <div className="row">
                        {admin ? (
                          admin.leaveRequests.length ? (
                            admin.leaveRequests.map((req, index) => {
                              return (
                                <LeaveRequestCard
                                  key={index}
                                  req={req}
                                  onApprove={this.onApprove}
                                  onReject={this.onReject}
                                />
                              );
                            })
                          ) : (
                            <small className="ml-4">
                              No leave requests pending...
                            </small>
                          )
                        ) : (
                          <small className="ml-4">
                            Loading leave requests...
                          </small>
                        )}
                      </div>
                    </div>
                    <hr />

                    <h1>Bonus Requests</h1>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                      }}
                    >
                      <div className="row">
                        {admin ? (
                          admin.bonusRequests.length ? (
                            admin.bonusRequests.map((req, index) => {
                              return (
                                <BonusRequestCard
                                  key={index}
                                  req={req}
                                  onApprove={this.onApprove}
                                  onReject={this.onReject}
                                />
                              );
                            })
                          ) : (
                            <small className="ml-4">
                              No bonus requests pending...
                            </small>
                          )
                        ) : (
                          <small className="ml-4">
                            Loading bonus requests...
                          </small>
                        )}
                      </div>
                    </div>

                    <hr />

                    <h1>Loan Requests</h1>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                      }}
                    >
                      <div className="row">
                        {admin ? (
                          admin.loanRequests.length ? (
                            admin.loanRequests.map((req, index) => {
                              return (
                                <LoanRequestCard
                                  key={index}
                                  req={req}
                                  onApprove={this.onApprove}
                                  onReject={this.onReject}
                                />
                              );
                            })
                          ) : (
                            <small className="ml-4">
                              No loan requests pending...
                            </small>
                          )
                        ) : (
                          <small className="ml-4">
                            Loaing loan requests...
                          </small>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          );
        }}
      </Consumer>
    );
  }
}
