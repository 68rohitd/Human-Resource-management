import React, { Component } from "react";
import { Consumer } from "../../context";
import { Redirect } from "react-router-dom";
import axios from "axios";
import { Spring } from "react-spring/renderprops";
import loginAvatar from "../../assets/login-signup-styles/loginAvatar.png";
import "../../assets/login-signup-styles/login-signup.css";
// import notes from "../../assets/images/notes.svg";
import notes from "../../assets/images/authentication.png";

class Signup extends Component {
  constructor() {
    super();

    this.state = {
      email: "",
      password: "",
      passwordCheck: "",
      name: "",
      error: "",
      disabled: false,

      // validation
      emailCheck: false,
      password1Check: false,
      password2Check: false,
    };
  }

  onSubmit = async (dispatch, e) => {
    e.preventDefault();

    // disable signup btn
    this.setState({
      disabled: true,
    });

    const { email, password, passwordCheck, name } = this.state;

    try {
      const newUser = await axios.post("/api/admin/register", {
        email,
        password,
        passwordCheck,
        name,
      });
      console.log("created acc successfully: ", newUser.data);
      // now login the user
      const loggedInUser = await axios.post("/api/admin/login", {
        email,
        password,
      });
      console.log("logged in successfully: ", loggedInUser.data);

      localStorage.setItem("auth-token", loggedInUser.data.token);
      localStorage.setItem("userId", loggedInUser.data.user._id);

      dispatch({
        type: "LOGGED_IN",
        payload: {
          user: loggedInUser.data.user,
          token: loggedInUser.data.token,
        },
      });

      this.props.history.push("/");
    } catch (err) {
      // enable signup btn
      this.setState({
        disabled: false,
      });

      console.log("ERROR: ", err.response.data.msg);
      this.setState({ error: err.response.data.msg });
    }
  };

  onChange = (e) => {
    const { name } = e.target;

    this.setState({ [e.target.name]: e.target.value }, () => {
      if (name === "email") {
        if (this.state.email.includes("@")) {
          if (this.state.email.includes(".")) {
            this.setState({ emailCheck: true });
          } else this.setState({ emailCheck: false });
        } else this.setState({ emailCheck: false });
      } else if (name === "password") {
        if (this.state.password.length >= 6) {
          this.setState({ password1Check: true });
        } else this.setState({ password1Check: false });
      } else if (name === "passwordCheck") {
        if (this.state.password === this.state.passwordCheck) {
          this.setState({ password2Check: true });
        } else this.setState({ password2Check: false });
      }
    });
  };

  render() {
    const { error } = this.state;

    return (
      <Consumer>
        {(value) => {
          let { dispatch, token } = value;
          if (token === undefined) token = "";

          if (!token) {
            return (
              <Spring
                from={{ opacity: 0 }}
                to={{ opacity: 1 }}
                config={{ duration: 300 }}
              >
                {(props) => (
                  <div style={props}>
                    <div className="row m-0">
                      <div className="col">
                        {/* <img className="signUpSVG" src={notes} alt="" /> */}
                        <img className="signUpSVG" src={notes} alt="" />
                      </div>

                      <div className="col-12 col-sm-12 col-md-4">
                        <div className="container">
                          <form
                            className="signUpForm "
                            onSubmit={this.onSubmit.bind(this, dispatch)}
                            style={{ marginTop: "85px" }}
                          >
                            <img
                              className="signUpAvatar"
                              src={loginAvatar}
                              alt=""
                            />
                            <h3 className="signUpText text-center mt-3">
                              Create new Admin Account!
                            </h3>

                            {error.length ? (
                              <div className="alert alert-danger mt-4">
                                {error}
                              </div>
                            ) : null}

                            <div className="col">
                              <div className="row">
                                {/* email */}
                                <div className="col">
                                  <input
                                    type="email"
                                    name="email"
                                    className="form-control mb-3 "
                                    placeholder="Email id"
                                    onChange={this.onChange}
                                    required
                                  />
                                </div>
                                {this.state.emailCheck ? (
                                  <div className="col-1 correctContainer">
                                    <i className="fa fa-check"></i>
                                  </div>
                                ) : null}
                              </div>

                              {/* password */}
                              <div className="row">
                                <div className="col">
                                  <input
                                    name="password"
                                    type="password"
                                    className="form-control mb-3"
                                    placeholder="Password"
                                    onChange={this.onChange}
                                    required
                                  />
                                </div>
                                {this.state.password1Check ? (
                                  <div className="col-1 correctContainer">
                                    <i className="fa fa-check"></i>
                                  </div>
                                ) : null}
                              </div>

                              {/* re-enter password */}
                              <div className="row">
                                <div className="col">
                                  <input
                                    name="passwordCheck"
                                    type="password"
                                    className="form-control mb-3"
                                    placeholder="Re-enter password"
                                    onChange={this.onChange}
                                    required
                                  />
                                </div>
                                {this.state.password2Check ? (
                                  <div className="col-1 correctContainer">
                                    <i className="fa fa-check"></i>
                                  </div>
                                ) : null}
                              </div>

                              <div className="row">
                                <div className="col">
                                  {/* name */}
                                  <input
                                    name="name"
                                    type="text"
                                    className="form-control mb-3"
                                    placeholder="name"
                                    onChange={this.onChange}
                                  />
                                </div>
                                {/* <div className="col-1 correctContainer"></div> */}
                              </div>

                              <div className="row">
                                {/* submit */}
                                <input
                                  disabled={this.state.disabled}
                                  type="submit"
                                  value="Signup"
                                  className="btn btn-success "
                                />
                              </div>
                            </div>
                          </form>
                        </div>
                      </div>
                      <div className="col-1"></div>
                    </div>
                  </div>
                )}
              </Spring>
            );
          } else {
            return <Redirect to="/" />;
          }
        }}
      </Consumer>
    );
  }
}

export default Signup;
