import axios from "axios";
import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { Consumer } from "../../../context";
import EmpSidePanel from "./EmpSidePanel";
import LeaveRequestTemplate from "./LeaveRequestTemplate";
import BonusRequestTemplate from "./BonusRequestTemplate";
import LoanRequestTemplate from "./LoanRequestTemplate";
import "../../../assets/view-single-req/viewSingleReq.css";

export default class ViewSingleRequest extends Component {
  constructor() {
    super();

    this.state = {
      reqDetails: {},
    };
  }

  componentDidMount = async () => {
    const { reqId } = this.props.match.params;
    const userId = localStorage.getItem("userId");

    const reqDetails = await axios.get(
      `/api/users/getSingleReqDetails/${userId}/${reqId}`
    );
    this.setState({
      reqDetails: reqDetails.data[0],
    });

    console.log(reqDetails.data[0]);
  };

  render() {
    return (
      <Consumer>
        {(value) => {
          const token = localStorage.getItem("auth-token");

          if (!token) return <Redirect to="/" />;

          const { title } = this.state.reqDetails;

          return (
            <div className="row m-0">
              {/* left part */}
              <div className="col-2 p-0 leftPart">
                <EmpSidePanel />
              </div>

              {/* right part */}
              <div className="col rightPart">
                {title === "leave request" ? (
                  <LeaveRequestTemplate reqDetails={this.state.reqDetails} />
                ) : null}
                {title === "bonus request" ? (
                  <BonusRequestTemplate reqDetails={this.state.reqDetails} />
                ) : null}
                {title === "loan request" ? (
                  <LoanRequestTemplate reqDetails={this.state.reqDetails} />
                ) : null}
              </div>
            </div>
          );
        }}
      </Consumer>
    );
  }
}
