import React, { Component } from "react";
import { Link } from "react-router-dom";
import maleProfilePic from "../../../assets/view-emp/maleUserPic.png";
import femaleProfilePic from "../../../assets/view-emp/femaleUserPic.png";
import "../../../assets/search-emp/empCard.css";

export default class EmpCard extends Component {
  onGetDate = (date) => {
    const d = new Date(date);
    let returnDate = d.toLocaleDateString("en-GB");
    return returnDate;
  };

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
          <div className="col p-0">
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
                <i className="fas fa-calendar-alt">
                  {" "}
                  {this.onGetDate(data.doj)}
                </i>
              </span>
              <br />
              {/* {data.skills ? <small>Skills: {data.skills}</small> : null} */}
            </div>
            <hr />
            <Link
              to={`/editEmpProfile/${data._id}`}
              style={{
                textDecoration: "none",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <input
                type="button"
                value="Full Details"
                className="btn btn-primary"
              />
            </Link>
          </div>
        </div>
      </div>
    );
  }
}
