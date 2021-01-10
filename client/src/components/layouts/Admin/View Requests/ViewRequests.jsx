import axios from "axios";
import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { Consumer } from "../../../../context";
import SidePanel from "../SidePanel";
import BonusRequestCard from "./BonusRequestCard";
import RequestCard from "./LeaveRequestCard";
import LoanRequestCard from "./LoanRequestCard";

export default class ViewRequests extends Component {
  constructor() {
    super();

    this.state = {
      user: undefined,
    };
  }

  componentDidMount = async () => {
    console.log("view req page mounted...");
    try {
      const token = localStorage.getItem("auth-token");
      // first check in admin model
      const tokenRes = await axios.post("/api/admin/tokenIsValid", null, {
        headers: { "x-auth-token": token },
      });

      if (tokenRes.data) {
        //logged in
        const adminRes = await axios.get("/api/admin", {
          headers: { "x-auth-token": token },
        });

        this.setState({
          user: adminRes.data.user,
        });
      }
    } catch (e) {
      console.log(e);
    }
  };

  callDispatch = (dispatch, req) => {
    switch (req.title) {
      case "leave request":
        let leaveUser = this.state.user;
        leaveUser.leaveRequests = leaveUser.leaveRequests.filter(
          (eachReq) => eachReq.reqId !== req.reqId
        );

        this.setState({
          user: leaveUser,
        });

        dispatch({
          type: "APPROVED_REJECTED_LEAVE",
          payload: {
            reqId: req.reqId,
          },
        });
        break;

      case "bonus request":
        let bonusUser = this.state.user;
        bonusUser.bonusRequests = bonusUser.bonusRequests.filter(
          (eachReq) => eachReq.reqId !== req.reqId
        );

        this.setState({
          user: bonusUser,
        });
        dispatch({
          type: "APPROVED_REJECTED_BONUS",
          payload: {
            reqId: req.reqId,
          },
        });
        break;

      case "loan request":
        let loanUser = this.state.user;
        loanUser.loanRequests = loanUser.loanRequests.filter(
          (eachReq) => eachReq.reqId !== req.reqId
        );

        this.setState({
          user: loanUser,
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
      console.log("Error: ", e.response.data.msg);
    }
  };

  render() {
    return (
      <Consumer>
        {(value) => {
          let { user } = this.state;

          const token = localStorage.getItem("auth-token");

          if (!token) return <Redirect to="/login" />;
          if (user && user.role !== "admin")
            return <Redirect to="/empDashBoard" />;

          return (
            <>
              <div className="row m-0">
                {/* left part */}
                <div className="col-2 p-0 leftPart">
                  <SidePanel />
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
                      {user ? (
                        user.leaveRequests.length ? (
                          user.leaveRequests.map((req, index) => {
                            return (
                              <RequestCard
                                key={index}
                                req={req}
                                onApprove={this.onApprove}
                                onReject={this.onReject}
                              />
                            );
                          })
                        ) : (
                          <small>No leave requests pending...</small>
                        )
                      ) : (
                        <small>Loading leave requests...</small>
                      )}
                    </div>

                    <hr />

                    <h1>Bonus Requests</h1>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                      }}
                    >
                      {user ? (
                        user.bonusRequests.length ? (
                          user.bonusRequests.map((req, index) => {
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
                          <small>No bonus requests pending...</small>
                        )
                      ) : (
                        <small>Loading bonus requests...</small>
                      )}
                    </div>

                    <hr />

                    <h1>Loan Requests</h1>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                      }}
                    >
                      {user ? (
                        user.loanRequests.length ? (
                          user.loanRequests.map((req, index) => {
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
                          <small>No loan requests pending...</small>
                        )
                      ) : (
                        <small>Loaing loan requests...</small>
                      )}
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
