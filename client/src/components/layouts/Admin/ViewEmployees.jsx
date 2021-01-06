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

  onDelete = async (emp) => {
    console.log("deleting: ", emp);
    const deletedEmp = await axios.delete(`/api/admin/delete/${emp._id}`);
    console.log("deleted: ", deletedEmp.data);
  };

  onEdit = async (emp) => {
    console.log("editing: ", emp);
  };

  componentDidMount = async () => {
    const empList = await axios.get("/api/admin/getEmpList");
    console.log("List: ", empList.data);
    this.setState({
      empList: empList.data,
    });
  };

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
                  return (
                    <EmpCard
                      key={index}
                      data={emp}
                      onDelete={this.onDelete}
                      onEdit={this.onEdit}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}
