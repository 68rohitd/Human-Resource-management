import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";
import { Consumer } from "../../context";
import { Spring } from "react-spring/renderprops";
// import loginSVG from "../../assets/login-signup-styles/login3.svg";
import loginAvatar from "../../assets/login-signup-styles/loginAvatar.png";
import "../../assets/login-signup-styles/login-signup.css";
// import authentication from "../../assets/images/authentication.svg";
import authentication from "../../assets/images/login.png";

class Login extends Component {
  constructor() {
    super();

    this.state = {
      email: "",
      password: "",
      error: "",
      disabled: false,
    };
  }

  onSubmit = async (dispatch, e) => {
    e.preventDefault();

    // disable loggin btn
    this.setState({
      disabled: true,
    });

    const { email, password } = this.state;

    try {
      // check in both MODELS since we dont know whether its admin or emp
      let loggedInUser;

      try {
        loggedInUser = await axios.post(`/api/admin/login`, {
          email,
          password,
        });
      } catch (e) {
        loggedInUser = await axios.post(`/api/users/login`, {
          email,
          password,
        });
      }

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
      if (email === "admin@gmail.com") this.props.history.push("/");
      else this.props.history.push("/empDashBoard");
    } catch (err) {
      // enable login btn
      this.setState({
        disabled: false,
      });

      console.log("ERROR: ", err);
      this.setState({ error: err.response.data.msg });
    }
  };

  onChange = (e) => this.setState({ [e.target.name]: e.target.value });

  render() {
    return (
      <Consumer>
        {(value) => {
          let { dispatch, token } = value;
          if (token === undefined) token = "";
          const { error } = this.state;

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
                        <img className="loginSVG" src={authentication} alt="" />
                      </div>
                      <div className="col-12 col-sm-12 col-md-4">
                        <div className="container">
                          <form
                            className="loginForm "
                            onSubmit={this.onSubmit.bind(this, dispatch)}
                          >
                            <img
                              className="loginAvatar"
                              src={loginAvatar}
                              alt=""
                            />

                            <h3 className="loginText text-center mt-3">
                              Login to Your Account
                            </h3>
                            {error.length ? (
                              <div className="alert alert-danger mt-4">
                                {error}
                              </div>
                            ) : null}
                            <input
                              type="email"
                              name="email"
                              className="form-control mb-3 mt-4"
                              placeholder="Email id"
                              onChange={this.onChange}
                              required
                            />
                            <input
                              name="password"
                              type="password"
                              className="form-control"
                              placeholder="password"
                              onChange={this.onChange}
                              required
                            />
                            <input
                              disabled={this.state.disabled}
                              type="submit"
                              value="Login"
                              className="btn btn-success btn-block mt-3"
                            />

                            <h6 className=" mt-3 alert alert-warning text-center">
                              <div className="row">
                                <div className="col">
                                  Admin: admin@gmail.com <br />
                                  User: {"<user>@gmail.com"} <br />
                                </div>
                              </div>
                              <div className="row mt-2">
                                <div className="col">
                                  Default password for all: password
                                </div>
                              </div>
                            </h6>
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

export default Login;
