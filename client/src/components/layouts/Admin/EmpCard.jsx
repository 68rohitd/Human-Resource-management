import React, { Component } from "react";
import { Link } from "react-router-dom";
import profilePic from "../../../assets/view-emp/userPic.png";

export default class EmpCard extends Component {
  render() {
    const { data } = this.props;
    console.log(data);
    return (
      <div>
        <div className="row jumbotron myCard p-0 m-3">
          <div className="col-3">
            <img
              style={{ marginLeft: "-0.5rem" }}
              src={profilePic}
              alt=""
              width="200rem"
            />
          </div>
          <div className="verticleLine"></div>
          <div className="col pr-0">
            <div className="row mt-3">
              <div className="col">
                <p className="">
                  Name:
                  {data.name}
                </p>
                <p className="">
                  role:
                  {data.role}
                </p>
                <p className="">
                  email:
                  {data.email}
                </p>
                <p className="">
                  team:
                  {data.team}
                </p>
              </div>
              <div className="col">
                <p className="">
                  Date of Joining:
                  {data.doj}
                </p>
                <p className="">
                  Skills:
                  {data.skills}
                </p>
                <p className="">
                  phoneNo:
                  {data.phoneNo}
                </p>
              </div>
              <div className="col-1">
                <div className="row m-0 mb-3">
                  <div
                    style={{ cursor: "pointer" }}
                    onClick={() => this.props.onDelete(data)}
                  >
                    ❌
                  </div>
                </div>
                <div className="row m-0">
                  <Link to={`/editEmpProfile/${data._id}`}>
                    <div
                      style={{ cursor: "pointer" }}
                      onClick={() => this.props.onEdit(data)}
                    >
                      ✏
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
