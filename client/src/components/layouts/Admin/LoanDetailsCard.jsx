import React, { Component } from "react";

export default class LoanDetailsCard extends Component {
  render() {
    const { loanRepaid, date, amount, loanNote } = this.props.loanDetails;
    console.log(this.props);
    return (
      <>
        <div className="row">
          <div className="col">
            <h6>Date: </h6>
            <h6>Loan amount: </h6>
          </div>

          <div className="col">
            <h6>{this.props.onGetDate(date)}</h6>
            <h6>₹{amount}</h6>
          </div>

          <div className="col">
            {loanRepaid ? (
              <input
                type="button"
                disabled={true}
                value="PAID"
                className="btn btn-success btn-sm"
              />
            ) : (
              <input
                type="button"
                value="mark as paid"
                className="btn btn-primary btn-sm"
                onClick={() => this.props.onMarkAsPaid(this.props.loanDetails)}
              />
            )}
          </div>
        </div>

        <div className="row">
          <div className="col">
            <h6>Loan note:</h6>
            <div className="jumbotron m-0 p-3">{loanNote}</div>
          </div>
        </div>
        <hr />
      </>
    );
  }
}
