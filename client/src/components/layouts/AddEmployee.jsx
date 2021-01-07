import React, { Component } from "react";
import { Consumer } from "../../context";
import { Redirect } from "react-router-dom";
import axios from "axios";
import { Spring } from "react-spring/renderprops";
import "../../assets/add-emp/addEmp.css";
import SidePanel from "./Admin/SidePanel";

class AddEmployee extends Component {
  constructor() {
    super();

    this.state = {
      email: "",
      name: "",
      role: "",
      address: "",
      phoneNo: "",
      team: "",
      gender: "Select Value",
      doj: "",
      disabled: false,
    };
  }

  onSelectGender = (gender) => this.setState({ gender });

  onSubmit = async (dispatch, e) => {
    e.preventDefault();

    // disable signup btn
    this.setState({
      disabled: true,
    });

    const {
      email,
      name,
      address,
      phoneNo,
      role,
      team,
      doj,
      gender,
    } = this.state;

    try {
      const newUser = await axios.post("/api/admin/addEmployee", {
        email,
        name,
        address,
        gender,
        phoneNo,
        role,
        team,
        doj,
      });
      console.log("created acc successfully: ", newUser.data);
    } catch (err) {
      // enable signup btn
      this.setState({
        disabled: false,
      });

      console.log("ERROR: ", err.response.data.msg);
      this.setState({ error: err.response.data.msg });
    }
  };

  onChange = (e) => this.setState({ [e.target.name]: e.target.value });

  render() {
    // const { error } = this.state;

    return (
      <Consumer>
        {(value) => {
          let { user, dispatch, token } = value;
          if (token === undefined) token = "";

          if (token) {
            if (user.role !== "admin") return <Redirect to="/" />;
            return (
              <Spring
                from={{ opacity: 0 }}
                to={{ opacity: 1 }}
                config={{ duration: 300 }}
              >
                {(props) => (
                  <>
                    <div className="row m-0">
                      {/* left part */}
                      <div className="col-2  p-0 leftPart">
                        <SidePanel />
                      </div>

                      {/* right part */}
                      <div
                        className="col"
                        style={{
                          display: "flex ",
                          flexDirection: "row",
                          justifyContent: "center",
                        }}
                      >
                        <div style={props}>
                          <form
                            className="addEmpForm"
                            onSubmit={this.onSubmit.bind(this, dispatch)}
                          >
                            <h3 className="">ADD EMPLOYEE</h3>
                            <hr />

                            <div className="row">
                              <div className="col">
                                {/* name */}
                                <label htmlFor="name">Name</label>
                                <input
                                  type="text"
                                  name="name"
                                  className="form-control"
                                  placeholder="Joey Tribbiani"
                                  onChange={this.onChange}
                                  required
                                />
                              </div>
                              <div className="col">
                                {/* email */}
                                <label htmlFor="email">Email</label>
                                <input
                                  type="email"
                                  name="email"
                                  className="form-control mb-3 "
                                  placeholder="joey@gmail.com"
                                  onChange={this.onChange}
                                  required
                                />
                              </div>
                            </div>

                            <div className="row">
                              <div className="col">
                                {/* address */}
                                <label htmlFor="address">Address</label>
                                <textarea
                                  name="address"
                                  id="address"
                                  // cols="20"
                                  rows="1"
                                  className="form-control mb-3 "
                                  placeholder="Mapusa, Goa"
                                  onChange={this.onChange}
                                  required
                                />
                              </div>
                              <div className="col">
                                {/* phone no */}
                                <label htmlFor="phoneNo">Phone No.</label>
                                <input
                                  type="number"
                                  name="phoneNo"
                                  className="form-control mb-3 "
                                  placeholder="1234567890"
                                  onChange={this.onChange}
                                  required
                                />
                              </div>
                            </div>

                            <div className="row">
                              {/* team */}
                              <div className="col">
                                <label htmlFor="team">Team</label>
                                <input
                                  type="text"
                                  name="team"
                                  className="form-control mb-3 "
                                  placeholder="Devops"
                                  onChange={this.onChange}
                                  required
                                />
                              </div>

                              {/* role */}
                              <div className="col">
                                <label htmlFor="role">Role</label>
                                <input
                                  type="text"
                                  name="role"
                                  className="form-control mb-3 "
                                  placeholder="ML Engineer"
                                  onChange={this.onChange}
                                  required
                                />
                              </div>
                            </div>

                            <div className="row">
                              {/* doj */}
                              <div className="col">
                                <label htmlFor="doj">Date Of Joining</label>
                                <input
                                  type="date"
                                  name="doj"
                                  className="form-control mb-3 "
                                  placeholder="doj"
                                  onChange={this.onChange}
                                  required
                                />
                              </div>

                              {/* gender */}
                              <div className="col">
                                <div className="col">
                                  <label>Gender</label>
                                  <div className="dropdown">
                                    <button
                                      className="btn btn-light dropdown-toggle"
                                      type="button"
                                      id="dropdownMenuButton"
                                      data-toggle="dropdown"
                                      aria-haspopup="true"
                                      aria-expanded="false"
                                    >
                                      {this.state.gender}
                                    </button>
                                    <div
                                      className="dropdown-menu"
                                      aria-labelledby="dropdownMenuButton"
                                    >
                                      <li
                                        className="dropdown-item"
                                        onClick={() =>
                                          this.onSelectGender("Male")
                                        }
                                      >
                                        Male
                                      </li>
                                      <li
                                        className="dropdown-item"
                                        onClick={() =>
                                          this.onSelectGender("Female")
                                        }
                                      >
                                        Female
                                      </li>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <input
                              disabled={this.state.disabled}
                              type="submit"
                              value="Submit"
                              className="btn btn-success btn-block "
                            />
                          </form>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </Spring>
            );
          } else {
            return <Redirect to="/login" />;
          }
        }}
      </Consumer>
    );
  }
}

export default AddEmployee;
