import React, { Component } from "react";

export default class LoanRequestTemplate extends Component {
  onGetDate = (date) => {
    const d = new Date(date);
    let returnDate = d.toLocaleDateString("en-GB");
    return returnDate;
  };

  render() {
    const {
      date,
      reqId,
      empEmail,
      empName,
      loanNote,
      loanReason,
      ticketClosed,
      approved,
    } = this.props.reqDetails;
    return (
      <div className="mySingleReqCard m-5">
        <div className="row">
          {/* subject */}
          <div className="col">
            <h1>{loanReason}</h1>
          </div>
          {/* GUI Progress */}
          <div className="col mt-3">
            <i className="fas fa-check-circle text-success"></i>
            <strong> Opened </strong>- - - - - -{"  "}
            <i className="fas fa-check-circle text-success"></i>
            <strong> Assigned </strong> - - - - - -{" "}
            {ticketClosed ? (
              <>
                <i className="fas fa-check-circle text-success"></i>{" "}
                <strong> Resolved </strong>
              </>
            ) : (
              <>
                <i className="fas fa-check-circle"></i>{" "}
                <strong> Resolved</strong>
              </>
            )}
          </div>
        </div>
        <hr />

        <div className="row">
          {/* first col */}
          <div className="col">
            <div className="row">
              <div className="col">
                <small>Request ID:</small>
                <h6>{reqId}</h6>
              </div>
            </div>

            <div className="row">
              <div className="col">
                <small>Created On:</small>
                <h6>{this.onGetDate(date)}</h6>
              </div>
            </div>

            <div className="row">
              <div className="col">
                <small>Status</small>
                {ticketClosed ? (
                  <>
                    <h6>Closed</h6>
                  </>
                ) : (
                  <h6>Pending</h6>
                )}
              </div>

              <div className="col">
                <small>Approved/Rejected</small>
                {ticketClosed ? (
                  approved ? (
                    <h6>Approved</h6>
                  ) : (
                    <h6>Rejected</h6>
                  )
                ) : (
                  <h6>NA</h6>
                )}
              </div>
            </div>
          </div>

          {/* second col */}
          <div className="col">
            <div className="row">
              <div className="col">
                <small>Raised By:</small>
                <h6>{empName}</h6>
              </div>
            </div>

            <div className="row">
              <div className="col">
                <small>Employee Email:</small>
                <h6>{empEmail}</h6>
              </div>
            </div>

            <div className="row">
              <div className="col">
                <small>Request:</small>
                <div className="reasonArea">
                  <h6>{loanNote}</h6>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
