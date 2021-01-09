import React, { Component } from "react";
import "../../../../assets/view-req/leaveReqCard.css";
import maleProfilePic from "../../../../assets/view-emp/maleUserPic.png";
import femaleProfilePic from "../../../../assets/view-emp/femaleUserPic.png";
import { Consumer } from "../../../../context";

export default class BonusRequestCard extends Component {
  render() {
    return (
      <Consumer>
        {(value) => {
          let { dispatch } = value;

          const {
            empName,
            bonusNote,
            empEmail,
            gender,
            empRole,
            empTeam,
          } = this.props.req;

          return (
            <div className="leaveReqCard">
              <div className="container mb-3">
                <div className="row">
                  <div className="col">
                    <img
                      src={
                        gender === "male" ? maleProfilePic : femaleProfilePic
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
                <hr className="m-0 my-3" />

                <div className="row">
                  <div className="col">
                    <h6>Team: </h6>
                    <h6>Role: </h6>
                  </div>

                  <div className="col text-right">
                    <h6>{empTeam}</h6>
                    <h6>{empRole}</h6>
                  </div>
                </div>

                <div className="row ">
                  <div className="col">
                    <h6>Note:</h6>
                    <div className="reasonContainer">{bonusNote}</div>
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
            </div>
          );
        }}
      </Consumer>
    );
  }
}
