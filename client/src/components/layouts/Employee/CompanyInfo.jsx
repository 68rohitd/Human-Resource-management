import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { Consumer } from "../../../context";
import EmpSidePanel from "./EmpSidePanel";
import Faq from "./Faq";
import HolidayList from "./HolidayList";
import CompanyPolicy from "./CompanyPolicy";
import { Spring } from "react-spring/renderprops";

export default class CompanyInfo extends Component {
  constructor() {
    super();

    this.state = {
      selectedTab: "Company Policy",
    };
  }

  onSelectedTab = (selectedTab) => this.setState({ selectedTab });

  render() {
    return (
      <Consumer>
        {(value) => {
          let { user } = value;
          const token = localStorage.getItem("auth-token");
          if (!token) return <Redirect to="/login" />;

          if (user && user.role === "admin") return <Redirect to="/" />;

          return (
            <Spring
              from={{ opacity: 0 }}
              to={{ opacity: 1 }}
              config={{ duration: 300 }}
            >
              {(props) => (
                <div className="row m-0">
                  {/* left part */}
                  <div className="col-2 p-0 leftPart">
                    <EmpSidePanel />
                  </div>

                  {/* right part */}
                  <div className="col rightPart container" style={props}>
                    <div className="row">
                      {/* tab selection */}
                      <div className="col">
                        <div className="text-right my-4">
                          <div
                            className="btn-group btn-group-toggle"
                            data-toggle="buttons"
                          >
                            <label className="btn btn-primary active">
                              <input
                                type="radio"
                                name="options"
                                id="option1"
                                defaultChecked={true}
                                onClick={() =>
                                  this.onSelectedTab("Company Policy")
                                }
                              />
                              Company Policy
                            </label>
                            <label className="btn btn-primary">
                              <input
                                type="radio"
                                name="options"
                                id="option2"
                                onClick={() =>
                                  this.onSelectedTab("Holiday List")
                                }
                              />
                              Holiday List
                            </label>
                            <label className="btn btn-primary">
                              <input
                                type="radio"
                                name="options"
                                id="option3"
                                onClick={() => this.onSelectedTab("FAQ")}
                              />
                              FAQ
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* main content */}
                    <div className="row">
                      <div className="col">
                        {this.state.selectedTab === "Company Policy" ? (
                          <CompanyPolicy />
                        ) : this.state.selectedTab === "FAQ" ? (
                          <Faq />
                        ) : (
                          <HolidayList />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </Spring>
          );
        }}
      </Consumer>
    );
  }
}
