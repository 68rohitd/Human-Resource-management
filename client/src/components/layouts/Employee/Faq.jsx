import React, { Component } from "react";
import { Link } from "react-router-dom";
import classNames from "classnames";

export default class Faq extends Component {
  constructor() {
    super();

    this.state = {
      expand1: false,
      expand2: false,
      expand3: false,
      expand4: false,
      expand5: false,
    };
  }

  render() {
    return (
      <div
        className="jumbotron pt-3"
        style={{ height: "460px", overflowY: "scroll" }}
      >
        <h1 className="text-center">FAQ's</h1>

        <div className="mb-5">
          <h5>
            How do I apply for leave?{" "}
            <i
              style={{ cursor: "pointer" }}
              onClick={() =>
                this.setState({
                  expand1: !this.state.expand1,
                })
              }
              className={classNames("fa", {
                "fa-caret-down": !this.state.expand1,
                "fa-caret-up": this.state.expand1,
              })}
            ></i>
          </h5>
          {this.state.expand1 ? (
            <p>
              1. Please head over to{" "}
              <Link to="/attendence">
                <span>Timesheet </span>
              </Link>
              <br />
              2. Fill in the required details like from date, to date <br />
              3. Enter a valid reason and submit the form <br />
              4. Once submitted, you can check the status of your request under{" "}
              <Link to="/myRequests">
                <span>My Tickets </span>
              </Link>
              tab <br />
            </p>
          ) : null}
        </div>

        <div className="mb-5">
          <h5>
            How do I apply for loan?{" "}
            <i
              style={{ cursor: "pointer" }}
              onClick={() =>
                this.setState({
                  expand2: !this.state.expand2,
                })
              }
              className={classNames("fa", {
                "fa-caret-down": !this.state.expand2,
                "fa-caret-up": this.state.expand2,
              })}
            ></i>
          </h5>
          {this.state.expand2 ? (
            <p>
              1. Please head over to{" "}
              <Link to="/otherRequest">
                <span>Send Request </span>
              </Link>
              <br />
              2. Head over{" "}
              <i>
                {" "}
                <b>Request for Loan</b>
              </i>{" "}
              form <br />
              3. Fill in the required details like loan reason, mode of
              repayment of loan
              <br />
              4. Enter the reason in brief, fill in the loan amount sought, and
              loan repayment period in months
              <br />
              5. Finally submit the form <br />
              6. Once submitted, you can check the status of your request under{" "}
              <Link to="/myRequests">
                <span>My Tickets </span>
              </Link>
              tab and heading over to loan request tab <br />
            </p>
          ) : null}
        </div>

        <div className="mb-5">
          <h5>
            How do I request for bonus?{" "}
            <i
              style={{ cursor: "pointer" }}
              onClick={() =>
                this.setState({
                  expand3: !this.state.expand3,
                })
              }
              className={classNames("fa", {
                "fa-caret-down": !this.state.expand3,
                "fa-caret-up": this.state.expand3,
              })}
            ></i>
          </h5>
          {this.state.expand3 ? (
            <p>
              1. Please head over to{" "}
              <Link to="/otherRequest">
                <span>Send Request </span>
              </Link>
              <br />
              2. Head over{" "}
              <i>
                {" "}
                <b>Request for Bonus</b>
              </i>{" "}
              form <br />
              3. Fill in the required details like bonus reason, enter the
              circumstances in brief
              <br />
              4. Finally submit the form <br />
              5. Once submitted, you can check the status of your request under{" "}
              <Link to="/myRequests">
                <span>My Tickets </span>
              </Link>
              tab and heading over to loan request tab <br />
            </p>
          ) : null}
        </div>

        <div className="mb-5">
          <h5>
            Where can I see my salary details?{" "}
            <i
              style={{ cursor: "pointer" }}
              onClick={() =>
                this.setState({
                  expand4: !this.state.expand4,
                })
              }
              className={classNames("fa", {
                "fa-caret-down": !this.state.expand4,
                "fa-caret-up": this.state.expand4,
              })}
            ></i>
          </h5>
          {this.state.expand4 ? (
            <p>
              1. Please head over to{" "}
              <Link to="/mySalDetails">
                <span>My Salary Details </span>
              </Link>
              <br />
              <strong>To know payroll history:</strong>
              <br />
              1. Select the month for which you want to view salary details and
              click on search <br />
              2. Salary details of that particular month would be displayed.
            </p>
          ) : null}
        </div>

        <div className="mb-5">
          <h5>
            How do I update my profile?{" "}
            <i
              style={{ cursor: "pointer" }}
              onClick={() =>
                this.setState({
                  expand5: !this.state.expand5,
                })
              }
              className={classNames("fa", {
                "fa-caret-down": !this.state.expand5,
                "fa-caret-up": this.state.expand5,
              })}
            ></i>
          </h5>
          {this.state.expand5 ? (
            <p>
              1. Please head over to{" "}
              <Link to="/profile">
                <span> Your Name </span>
              </Link>{" "}
              on the navigation bar
              <br />
              2. Click on edit button to enter into edit mode <br />
              3. Once done editing, click on save profile <br />
              4. Enter all the necessary details <br />
              5. Change <strong>password</strong> if necessary <br />
              <br />
            </p>
          ) : null}
        </div>
      </div>
    );
  }
}
