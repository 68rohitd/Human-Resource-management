import React, { Component } from "react";
import { Link } from "react-router-dom";
import profilePic from "../../../assets/view-emp/userPic.png";
import "../../../assets/search-emp/empCard.css";

export default class EmpCard extends Component {
  render() {
    const { data } = this.props;

    return (
      <div className="myCard">
        <div className="row">
          <div className="col">
            <img src={profilePic} alt="" width="100px" height="100px" />
            <i
              className="fas fa-pencil-alt"
              style={{ cursor: "pointer" }}
              onClick={() => this.props.onEdit(data)}
            ></i>
            <i
              className="fas fa-times-circle"
              style={{ cursor: "pointer" }}
              onClick={() => this.props.onDelete(data)}
            ></i>
          </div>
        </div>

        <hr />

        <div className="row">
          <div className="col">
            <span className="text-center">
              <h2>{data.name}</h2>
              <p style={{ fontSize: "13px" }}>{data.email}</p>
            </span>
            <h5>{data.role}</h5>
            <h5>{data.team}</h5>
            <h5>{data.doj}</h5>
            <h5>{data.skills}</h5>
          </div>
        </div>
      </div>
    );
  }
}
