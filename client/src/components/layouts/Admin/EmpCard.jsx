import React, { Component } from "react";
import { Link } from "react-router-dom";
import maleProfilePic from "../../../assets/view-emp/maleUserPic.png";
import femaleProfilePic from "../../../assets/view-emp/femaleUserPic.png";
import "../../../assets/search-emp/empCard.css";

export default class EmpCard extends Component {
  render() {
    const { data } = this.props;

    return (
      <div className="myCard">
        <div className="row">
          <div
            className="col"
            style={{ display: "flex", justifyContent: "center" }}
          >
            <img
              src={data.gender === "Male" ? maleProfilePic : femaleProfilePic}
              alt="profile pic"
              width="100px"
            />
          </div>
        </div>

        <hr />

        <div className="row">
          <div className="col">
            <span className="text-center">
              <h4>{data.name.toUpperCase()}</h4>

              <p style={{ fontSize: "13px" }}>
                <i className="fas fa-envelope"> {data.email}</i>
              </p>
            </span>
            <div className="text-center">
              <span>Team: {data.team}</span> <br />
              <span>Role: {data.role}</span> <br />
              <span>
                <i className="fas fa-calendar-alt"> {data.doj}</i>
              </span>
              <br />
              {data.skills ? <h5>Skills: {data.skills}</h5> : null}
            </div>
            <hr />
            <Link
              to={`/editEmpProfile/${data._id}`}
              style={{ textDecoration: "none" }}
            >
              <input
                type="button"
                value="More Info"
                className="btn btn-secondary btn-block"
              />
            </Link>
          </div>
        </div>
      </div>
    );
  }
}
