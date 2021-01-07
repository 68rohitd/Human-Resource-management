import axios from "axios";
import React, { Component } from "react";
import EmpCard from "./EmpCard";
import SearchEmp from "./SearchEmp";
import SidePanel from "./SidePanel";

export default class ViewEmployees extends Component {
  constructor() {
    super();

    this.state = {
      empList: [],
    };
  }

  componentDidMount = async () => {
    const empList = await axios.get("/api/admin/getEmpList");
    console.log("List: ", empList.data);
    this.setState({
      empList: empList.data,
    });
  };

  // to filter data according to search criteria
  onFilter = (empList) => {
    this.setState({ empList });
  };

  render() {
    return (
      <>
        <div className="row m-0">
          {/* left part */}
          <div className="col-2 p-0 leftPart">
            <SidePanel />
          </div>

          {/* right part */}
          <div className="col">
            <div className="row">
              <SearchEmp onFilter={this.onFilter} />
            </div>

            <hr />

            {/* search result */}
            <div className="container">
              <div
                className="row"
                style={{
                  display: "flex",
                }}
              >
                {this.state.empList.map((emp, index) => {
                  return <EmpCard key={index} data={emp} />;
                })}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}
