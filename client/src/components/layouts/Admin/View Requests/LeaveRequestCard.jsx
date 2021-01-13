import React, { Component } from "react";
import "../../../../assets/view-req/leaveReqCard.css";
import maleProfilePic from "../../../../assets/view-emp/maleUserPic.png";
import femaleProfilePic from "../../../../assets/view-emp/femaleUserPic.png";
import { Consumer } from "../../../../context";
import { Link } from "react-router-dom";

export default class LeaveRequestCard extends Component {
  render() {
    return (
      <Consumer>
        {(value) => {
          let { dispatch } = value;

          const {
            empId,
            empName,
            reason,
            empTeam,
            empRole,
            fromDate,
            toDate,
            empEmail,
            gender,
          } = this.props.req;
          console.log(this.props.req);

          return (
            <div className="leaveReqCard">
              {/* <div className="mb-3"> */}
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
              <hr className="mt-2" />

              <div className="row">
                <div className="col">
                  <h6>Team: </h6>
                </div>
                <div className="col">
                  <h6 className="text-right">{empTeam}</h6>
                </div>
              </div>

              <div className="row">
                <div className="col">
                  <h6>Role: </h6>
                </div>
                <div className="col">
                  <h6 className="text-right">{empRole}</h6>
                </div>
              </div>

              <div className="row">
                <div className="col">
                  <h6>From: </h6>
                </div>
                <div className="col">
                  <h6 className="text-right">{fromDate}</h6>
                </div>
              </div>

              <div className="row">
                <div className="col">
                  <h6>To: </h6>
                </div>
                <div className="col">
                  <h6 className="text-right">{toDate}</h6>
                </div>
              </div>

              <div className="row ">
                <div className="col">
                  <h6>Reason:</h6>
                  <div className="reasonContainer">{reason}</div>
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
                    className="btn btn-success btn-block"
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
                    className="btn btn-danger btn-block"
                    value="Reject"
                    onClick={() =>
                      this.props.onReject(this.props.req, dispatch)
                    }
                  />
                </div>
              </div>
            </div>
            // </div>
          );
        }}
      </Consumer>
    );
  }
}
