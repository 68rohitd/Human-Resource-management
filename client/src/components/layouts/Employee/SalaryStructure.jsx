import React, { Component } from "react";
import "../../../assets/my-sal-details/mySalDetails.css";
import ReactTooltip from "react-tooltip";
export default class SalaryStructure extends Component {
  render() {
    const {
      title,
      basicPay,
      totalLeaves,
      travelAllowance,
      medicalAllowance,
      bonus,
      salary,
    } = this.props;

    return (
      <div className="row">
        <div className="col">
          <div className="container">
            <h1>{title}</h1>
            <hr />

            <div className="row mb-4">
              <div className="col">
                <h3 className="text-left">Components</h3>
              </div>
              <div className="col">
                <h3 className="text-right">Amount</h3>
              </div>
            </div>

            <div className="row">
              <div className="col">
                <h6 className="text-left">Basic Pay</h6>
              </div>
              <div className="col">
                <h6 className="text-right">₹ {basicPay}</h6>
              </div>
            </div>

            <hr className="myHrLine" />

            <div className="row">
              <div className="col">
                <h6 className="text-left">Medical Allowance</h6>
              </div>
              <div className="col">
                <h6 className="text-right">₹ {medicalAllowance}</h6>
              </div>
            </div>

            <hr className="myHrLine" />

            <div className="row">
              <div className="col">
                <h6 className="text-left">Travel Allowance</h6>
              </div>
              <div className="col">
                <h6 className="text-right">₹ {travelAllowance}</h6>
              </div>
            </div>

            <hr className="myHrLine" />

            <div className="row">
              <ReactTooltip place="bottom" delayShow={100} html={true} />
              <div className="col">
                <h6 className="text-left">Total Leaves</h6>
              </div>
              <div className="col">
                <h6 className="text-right">
                  {totalLeaves} days{" "}
                  <i
                    className="fas fa-info-circle text-secondary"
                    data-tip="For leaves above 3 days, salary will be deducted accordingly"
                  ></i>
                </h6>
              </div>
            </div>

            <hr className="myHrLine" />

            <div className="row">
              <div className="col">
                <h6 className="text-left">Bonus</h6>
              </div>
              <div className="col">
                <h6 className="text-right">₹ {bonus}</h6>
              </div>
            </div>

            <hr className="myHrLine" />

            <div className="row">
              <div className="col">
                <h4 className="text-left">Gross Salary</h4>
              </div>
              <div className="col">
                <h4 className="text-right">₹ {salary}</h4>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
