import React, { Component } from "react";
import { Consumer } from "../../context";
import { Redirect } from "react-router-dom";
import axios from "axios";
import { Spring } from "react-spring/renderprops";
import "../../assets/login-signup-styles/login-signup.css";
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
                    <div className="row">
                      {/* left part */}
                      <div className="col-3">
                        <SidePanel />
                      </div>

                      {/* right part */}
                      <div className="col">
                        <div style={props}>
                          <form
                            className="signUpForm "
                            onSubmit={this.onSubmit.bind(this, dispatch)}
                          >
                            {/* email */}
                            <input
                              type="email"
                              name="email"
                              className="form-control mb-3 "
                              placeholder="Email id"
                              onChange={this.onChange}
                              required
                            />
                            {/* name */}
                            <input
                              type="text"
                              name="name"
                              className="form-control mb-3 "
                              placeholder="name"
                              onChange={this.onChange}
                              required
                            />

                            {/* gender */}
                            <div className="dropdown">
                              <label>gender</label>
                              <button
                                className="btn btn-secondary dropdown-toggle"
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
                                  onClick={() => this.onSelectGender("male")}
                                >
                                  Male
                                </li>
                                <li
                                  className="dropdown-item"
                                  onClick={() => this.onSelectGender("female")}
                                >
                                  Female
                                </li>
                              </div>
                            </div>

                            {/* address */}
                            <input
                              type="text"
                              name="address"
                              className="form-control mb-3 "
                              placeholder="address"
                              onChange={this.onChange}
                              required
                            />
                            {/* phone no */}
                            <input
                              type="number"
                              name="phoneNo"
                              className="form-control mb-3 "
                              placeholder="phoneNo"
                              onChange={this.onChange}
                              required
                            />
                            {/* role */}
                            <input
                              type="text"
                              name="role"
                              className="form-control mb-3 "
                              placeholder="role"
                              onChange={this.onChange}
                              required
                            />
                            {/* team */}
                            <input
                              type="text"
                              name="team"
                              className="form-control mb-3 "
                              placeholder="team"
                              onChange={this.onChange}
                              required
                            />
                            {/* doj */}
                            <input
                              type="date"
                              name="doj"
                              className="form-control mb-3 "
                              placeholder="doj"
                              onChange={this.onChange}
                              required
                            />
                            <input
                              disabled={this.state.disabled}
                              type="submit"
                              value="Submit"
                              className="btn btn-success "
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
