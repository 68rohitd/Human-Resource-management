import React, { Component } from "react";

export default class LoanDetailsCard extends Component {
  render() {
    const {
      loanRepaid,
      date,
      amount,
      loanNote,
      loanReason,
      modeOfRepayment,
      timePeriod,
    } = this.props.loanDetails;

    console.log(this.props);
    return (
      <>
        <div className="row">
          <div className="col">
            <h6>Date: </h6>
          </div>
          <div className="col">
            <h6>{this.props.onGetDate(date)}</h6>
          </div>
        </div>

        <div className="row">
          <div className="col">
            <h6>Amount: </h6>
          </div>
          <div className="col">
            <h6>₹{amount}</h6>
          </div>
        </div>

        <div className="row">
          <div className="col">
            <h6>Subject: </h6>
          </div>
          <div className="col">
            <h6>{loanReason}</h6>
          </div>
        </div>

        <div className="row">
          <div className="col">
            <h6>Time Period: </h6>
          </div>
          <div className="col">
            <h6>{timePeriod} months</h6>
          </div>
        </div>

        <div className="row">
          <div className="col">
            <h6>Mode Of Repayment: </h6>
          </div>
          <div className="col">
            <h6>{modeOfRepayment}</h6>
          </div>
        </div>

        <div className="row">
          <div className="col">
            <h6>Loan note:</h6>
            <div className="jumbotron mx-0 my-2 p-3">{loanNote}</div>
          </div>
        </div>

        {this.props.isAdmin ? (
          <>
            <div className="row">
              <div className="col">
                {loanRepaid ? (
                  <input
                    type="button"
                    disabled={true}
                    value="Paid"
                    className="btn btn-success btn-block"
                  />
                ) : (
                  <input
                    type="button"
                    value="Mark As Paid"
                    className="btn btn-primary btn-block"
                    onClick={() =>
                      this.props.onMarkAsPaid(this.props.loanDetails)
                    }
                  />
                )}
              </div>
            </div>

            <hr
              style={{
                border: "dashed",
                borderWidth: "1px",
                borderColor: "grey",
              }}
            />
          </>
        ) : (
          <>
            {loanRepaid ? (
              <input
                type="button"
                value="Paid"
                className="btn btn-success btn-block"
                disabled={true}
              />
            ) : (
              <input
                type="button"
                value="Pending"
                className="btn btn-primary btn-block"
                disabled={true}
              />
            )}
            <hr
              style={{
                border: "dashed",
                borderWidth: "1px",
                borderColor: "grey",
              }}
            />
          </>
        )}
      </>
    );
  }
}
