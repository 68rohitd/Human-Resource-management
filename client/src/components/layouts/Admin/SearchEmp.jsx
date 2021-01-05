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
      //   startDoj: "",
      //   endDoj: "",
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
        // startDoj,
        // endDoj,
      });

      this.props.onFilter(res.data);
      console.log(res.data);

      this.setState({
        name: "",
        role: "",
        team: "",
        email: "",
        doj: "",
        // startDoj: "",
        // endDoj: "",
      });
    } catch (err) {
      console.log("Error: ", err.response.data);
    }
  };

  render() {
    return (
      <div>
        <div className="col mt-4">
          <form className="myForm p-0 pb-4 px-3 mt-4">
            <div className="row myHeading bg-dark mb-2">
              <p className="text-center mb-0 py-3">Search & Filter</p>
            </div>
            <div className="row mt-3">
              <div className="col">
                <div className="form-group">
                  <input
                    name="name"
                    placeholder="Name"
                    type="text"
                    id="name"
                    className="form-control"
                    onChange={this.onChange}
                  />
                </div>
              </div>
            </div>

            <div className="form-group">
              <input
                placeholder="Role"
                name="role"
                type="text"
                id="role"
                className="form-control mb-3 mb-3"
                onChange={this.onChange}
              />
            </div>

            <div className="form-group">
              <input
                placeholder="Email"
                name="email"
                type="email"
                id="email"
                className="form-control mb-3"
                onChange={this.onChange}
              />
            </div>

            <div className="form-group">
              <div className="row">
                <div className="col">
                  <input
                    placeholder="Team"
                    name="team"
                    type="text"
                    id="team"
                    className="form-control mb-3"
                    onChange={this.onChange}
                  />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label>Date Of Joining</label>
              <div className="row">
                <div className="col">
                  <input
                    placeholder="Date"
                    name="doj"
                    type="date"
                    id="doj"
                    className="form-control mb-3"
                    onChange={this.onChange}
                  />
                </div>
                {/* <div className="col">
                  <label htmlFor="dojRange">date range</label>
                  <input
                    type="checkbox"
                    name="dojRange"
                    id="dojRange"
                    checked={this.state.dojCheck}
                    onChange={this.toggleDateRange}
                  />
                </div> */}
              </div>
            </div>

            {/* {this.state.dojCheck ? (
              <div>
                <div className="row">
                  <div className="col">
                    <label>From: </label>
                  </div>
                  <div className="col">
                    <input
                      name="startDoj"
                      type="date"
                      id="startDoj"
                      className="form-control mb-3"
                      onChange={this.onChange}
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col">
                    <label>To:</label>
                  </div>
                  <div className="col">
                    <input
                      name="endDoj"
                      type="date"
                      id="endDoj"
                      className="form-control mb-3"
                      onChange={this.onChange}
                    />
                  </div>
                </div>
              </div>
            ) : null} */}
            <input
              type="button"
              value="Search"
              onClick={this.onSubmit}
              className="btn btn-dark btn-block mt-3"
            />
          </form>
        </div>
      </div>
    );
  }
}
