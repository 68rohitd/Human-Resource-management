import React, { Component } from "react";
import "../../../../assets/view-req/leaveReqCard.css";
import maleProfilePic from "../../../../assets/view-emp/maleUserPic.png";
import femaleProfilePic from "../../../../assets/view-emp/femaleUserPic.png";

export default class LoanRequestCard extends Component {
  render() {
    const {
      empName,
      loanNote,
      empEmail,
      gender,
      empRole,
      empTeam,
      amount,
    } = this.props.req;
    console.log(this.props.req);

    return (
      <div className="leaveReqCard">
        <div className="container mb-3">
          <div className="row">
            <div className="col">
              <img
                src={gender === "male" ? maleProfilePic : femaleProfilePic}
                alt="profile pic"
                width="100px"
              />
            </div>
            <div className="col text-right">
              <h4>{empName}</h4>
              <h6>{empEmail}</h6>
            </div>
          </div>
          <hr className="m-0 my-3" />

          <div className="row">
            <div className="col">
              <h6>Team: </h6>
              <h6>Role: </h6>
              <h6>Loan Amount: </h6>
            </div>

            <div className="col text-right">
              <h6>{empTeam}</h6>
              <h6>{empRole}</h6>
              <h6>₹{amount}</h6>
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
              <i
                className="fas fa-check-circle text-success"
                style={{ fontSize: "40px", cursor: "pointer" }}
                onClick={() => this.props.onApprove(this.props.req)}
              ></i>
            </div>

            <div
              className="col"
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
              }}
            >
              <i
                className="fas fa-times-circle text-danger"
                style={{ fontSize: "40px", cursor: "pointer" }}
                onClick={() => this.props.onReject(this.props.req)}
              ></i>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
