import axios from "axios";
import React, { Component } from "react";
import EmpCard from "./EmpCard";
import SearchEmp from "./SearchEmp";

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

  render() {
    return (
      <div className="row">
        <div className="col-3">
          <SearchEmp />
        </div>
        <div className="col">
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
    );
  }
}
