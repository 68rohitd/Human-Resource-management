import React, { Component } from "react";
import "../../../../assets/view-req/leaveReqCard.css";
import maleProfilePic from "../../../../assets/view-emp/maleUserPic.png";
import femaleProfilePic from "../../../../assets/view-emp/femaleUserPic.png";
import { Consumer } from "../../../../context";
import { Link } from "react-router-dom";

export default class LoanRequestCard extends Component {
  render() {
    return (
      <Consumer>
        {(value) => {
          let { dispatch } = value;
          console.log(this.props.req);
          const {
            empId,
            empName,
            loanNote,
            empEmail,
            gender,
            empRole,
            empTeam,
            amount,
            loanReason,
            modeOfRepayment,
            timePeriod,
          } = this.props.req;

          return (
            <div className="leaveReqCard">
              <Link
                to={`/editEmpProfile/${empId}`}
                style={{ textDecoration: "none", color: "#303030" }}
              >
                <div className="row">
                  <div className="col">
                    <img
                      src={
                        gender === "Male" ? maleProfilePic : femaleProfilePic
                      }
                      alt="profile pic"
                      width="100px"
                    />
                  </div>
                  <div className="col text-right">
                    <h4>{empName}</h4>
                    <h6>{empEmail}</h6>
                  </div>
                </div>
              </Link>
              <hr className="m-0 my-3" />

              <div className="row">
                <div className="col">
                  <h6>Team: </h6>
                  <h6>Role: </h6>
                  <h6>Loan Amount: </h6>
                  <h6>Subject: </h6>
                  <h6>Time Period: </h6>
                  <h6>Mode of Repayment: </h6>
                </div>

                <div className="col text-right">
                  <h6>{empTeam}</h6>
                  <h6>{empRole}</h6>
                  <h6>₹{amount}</h6>
                  <h6>{loanReason}</h6>
                  <h6>{timePeriod} months</h6>
                  <h6>{modeOfRepayment}</h6>
                </div>
              </div>

              <div className="row ">
                <div className="col">
                  <h6>Note:</h6>
                  <div className="reasonContainer">{loanNote}</div>
                </div>
              </div>

              <div className="row">
                <div
                  className="col"
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                  }}
                >
                  <input
                    type="button"
                    className="btn btn-success"
                    value="Accept"
                    onClick={() =>
                      this.props.onApprove(this.props.req, dispatch)
                    }
                  />
                </div>

                <div
                  className="col"
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                  }}
                >
                  <input
                    type="button"
                    className="btn btn-danger"
                    value="Reject"
                    onClick={() =>
                      this.props.onReject(this.props.req, dispatch)
                    }
                  />
                </div>
              </div>
            </div>
          );
        }}
      </Consumer>
    );
  }
}
