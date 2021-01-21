import React, { Component } from "react";
import "../../../../assets/view-req/leaveReqCard.css";
import maleProfilePic from "../../../../assets/view-emp/maleUserPic.png";
import femaleProfilePic from "../../../../assets/view-emp/femaleUserPic.png";
import { Consumer } from "../../../../context";
import { Link } from "react-router-dom";
import axios from "axios";
import ReactTooltip from "react-tooltip";

export default class LeaveRequestCard extends Component {
  downloadAttachment = async (attachmentName) => {
    axios({
      url: `/api/users/download/${attachmentName}`,
      method: "POST",
      responseType: "blob", // important
    }).then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", attachmentName);
      document.body.appendChild(link);
      link.click();
    });
  };

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
            subject,
            attachmentName,
          } = this.props.req;

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
                  <h6>
                    Reason:{" "}
                    {attachmentName ? (
                      <>
                        <ReactTooltip
                          place="bottom"
                          delayShow={100}
                          html={true}
                        />
                        <i
                          onClick={() =>
                            this.downloadAttachment(attachmentName)
                          }
                          data-tip={attachmentName.slice(13)}
                          className="fa fa-paperclip mb-2"
                          style={{ fontSize: "18px", cursor: "pointer" }}
                        >
                          <small> {attachmentName.slice(13)}</small>
                        </i>
                      </>
                    ) : null}
                  </h6>

                  <div className="reasonContainer">
                    <b>{subject}</b> <br />
                    {reason}
                  </div>
                </div>
              </div>

              {/* {attachmentName ? (
                <div className="row mt-4">
                  <div className="col">
                    <h6
                      style={{ cursor: "pointer" }}
                      onClick={() => this.downloadAttachment(attachmentName)}
                    >
                      <i
                        className="fa fa-paperclip mb-2"
                        style={{ fontSize: "22px" }}
                      ></i>{" "}
                      {attachmentName.slice(13)}
                    </h6>
                  </div>
                </div>
              ) : null} */}

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
