import React, { Component } from "react";
import { Consumer } from "../../context";
import { Redirect } from "react-router-dom";
import axios from "axios";
import { Spring } from "react-spring/renderprops";
import "../../assets/login-signup-styles/login-signup.css";

class AddEmployee extends Component {
  constructor() {
    super();

    this.state = {
      email: "",
      name: "",
      salary: "",
      role: "",
      address: "",
      phoneNo: "",
      team: "",
      disabled: false,
    };
  }

  onSubmit = async (dispatch, e) => {
    e.preventDefault();

    // disable signup btn
    this.setState({
      disabled: true,
    });

    const { email, name, address, phoneNo, role, salary, team } = this.state;

    try {
      const newUser = await axios.post("/api/users/addEmployee", {
        email,
        name,
        address,
        phoneNo,
        role,
        salary,
        team,
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
    const { error } = this.state;

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
                      {/* address */}
                      <input
                        type="text"
                        name="address"
                        className="form-control mb-3 "
                        placeholder="address"
                        onChange={this.onChange}
                        required
                      />
                      {/* salary */}
                      <input
                        type="number"
                        name="salary"
                        className="form-control mb-3 "
                        placeholder="salary"
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
                      <input
                        disabled={this.state.disabled}
                        type="submit"
                        value="Submit"
                        className="btn btn-success "
                      />
                    </form>
                  </div>
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
