import axios from "axios";
import React, { Component } from "react";
import "../../../assets/search-emp/searchEmp.css";

export default class SearchEmp extends Component {
  constructor() {
    super();

    this.state = {
      name: "",
      role: "",
      email: "",
      team: "",
      doj: "",
      dojCheck: false,
    };
  }

  toggleDateRange = () => this.setState({ dojCheck: !this.state.dojCheck });

  onChange = (e) => this.setState({ [e.target.name]: e.target.value });

  onSubmit = async (e) => {
    e.preventDefault();

    let { name, role, team, email, doj } = this.state;

    try {
      const res = await axios.post("/api/admin/search", {
        name,
        role,
        team,
        email,
        doj,
      });

      this.props.onFilter(res.data);
      console.log(res.data);
    } catch (err) {
      console.log("Error: ", err.response.data);
    }
  };

  render() {
    return (
      <div className="container mt-3">
        <form onSubmit={this.onSubmit}>
          <div className="row mt-3 px-3">
            <div className="col">
              <label htmlFor="name">Name</label>
              <div className="form-group">
                <input
                  name="name"
                  placeholder="Joey Tribbiani"
                  type="text"
                  id="name"
                  className="form-control"
                  onChange={this.onChange}
                />
              </div>
            </div>

            <div className="col">
              <label htmlFor="role">Role</label>
              <div className="form-group">
                <input
                  placeholder="Front End Developer"
                  name="role"
                  type="text"
                  id="role"
                  className="form-control mb-3 mb-3"
                  onChange={this.onChange}
                />
              </div>
            </div>

            <div className="col">
              <label htmlFor="email">Email</label>
              <div className="form-group">
                <input
                  placeholder="joey@gmail.com"
                  name="email"
                  type="email"
                  id="email"
                  className="form-control mb-3"
                  onChange={this.onChange}
                />
              </div>
            </div>

            <div className="col">
              <label htmlFor="team">Team</label>
              <div className="form-group">
                <input
                  placeholder="Development"
                  name="team"
                  type="text"
                  id="team"
                  className="form-control mb-3"
                  onChange={this.onChange}
                />
              </div>
            </div>

            <div className="col">
              <label htmlFor="doj">Date Of Joining</label>
              <div className="form-group">
                <input
                  placeholder="Date"
                  name="doj"
                  type="date"
                  id="doj"
                  className="form-control"
                  onChange={this.onChange}
                />
              </div>
            </div>

            <div
              className="col"
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <div className="form-group m-0 p-0">
                <button className="btn btn-primary">
                  <i
                    className="fas fa-search p-2"
                    style={{ cursor: "pointer", fontSize: "20px" }}
                  ></i>
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  }
}
