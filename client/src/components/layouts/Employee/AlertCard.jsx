import React, { Component } from "react";
import classNames from "classnames";
import ReactTooltip from "react-tooltip";

export default class AlertCard extends Component {
  onGetDate = (date) => {
    const d = new Date(date);
    let returnDate = d.toLocaleDateString("en-GB");
    return returnDate;
  };

  render() {
    const { approved, createdOn, reason, subject, reqId } = this.props.data;

    return (
      <div
        className={classNames("alert alert-dismissible fade show", {
          "alert-success": approved,
          "alert-danger": !approved,
        })}
        role="alert"
      >
        {approved ? (
          <small>Request Approved</small>
        ) : (
          <small>Request Rejected</small>
        )}

        <ReactTooltip place="bottom" delayShow={100} html={true} />
        <h6>
          {subject}{" "}
          <i
            className="fas fa-info-circle text-secondary"
            data-tip={`Reason<br /> ${reason}, <br /><br /> Created On<br /> ${this.onGetDate(
              createdOn
            )}`}
          ></i>
        </h6>

        <button
          type="button"
          className="close"
          data-dismiss="alert"
          aria-label="Close"
          onClick={() => this.props.onDeleteAlert(reqId)}
        >
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
    );
  }
}
