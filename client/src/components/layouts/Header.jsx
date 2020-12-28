import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Consumer } from "../../context";
import "../../assets/header-styles/header.css";

class Header extends Component {
  constructor() {
    super();
    this.state = {
      deleteAccount: false,
    };
  }

  OnLogout = (dispatch) => {
    localStorage.setItem("auth-token", "");
    localStorage.setItem("userId", "");
    console.log("Logged out!");

    dispatch({
      type: "LOGGED_OUT",
    });
  };

  OnDeleteAccount = async (dispatch) => {
    const token = localStorage.getItem("auth-token");
    const userId = localStorage.getItem("userId");

    try {
      await axios.delete(`/users/delete/${userId}`, {
        headers: { "x-auth-token": token },
      });

      localStorage.setItem("auth-token", "");
      localStorage.setItem("userId", "");

      dispatch({
        type: "LOGGED_OUT",
      });
    } catch (err) {
      console.log(err.response.data);
    }
  };

  getInfo = (todos) => {
    let completed = 0;
    todos.forEach((todoItem) => {
      if (todoItem.finished) completed++;
    });
    return completed;
  };

  render() {
    const { branding } = this.props;

    return (
      <Consumer>
        {(value) => {
          let { dispatch, token, user, todos } = value;

          if (token === undefined) token = "";
          if (user === undefined) user = "";
          if (todos === undefined) todos = [];

          // getting token from localstorage for removing delay
          const localToken = localStorage.getItem("auth-token");

          return (
            <>
              <nav className="myNavBar navbar sticky-top navbar-expand-lg navbar-light">
                <Link to="/" className="navbar-brand text-light block mx-4">
                  <span
                    style={{
                      display: "block",
                    }}
                  >
                    {branding}
                  </span>
                </Link>

                <button
                  className="hamIcon navbar-toggler"
                  type="button"
                  data-toggle="collapse"
                  data-target="#navbarNavAltMarkup"
                  style={{
                    position: "fixed",
                    right: "10px",
                    top: "10px",
                  }}
                >
                  <i className="fa fa-bars"></i>
                </button>

                <div
                  className="collapse navbar-collapse"
                  id="navbarNavAltMarkup"
                >
                  <div className="navbar-nav">
                    {/* about  */}
                    <li className="nav-item ">
                      <Link
                        to="/about"
                        className="nav-link text-light "
                        style={{ cursor: "pointer", fontSize: 16 }}
                      >
                        About
                      </Link>
                    </li>
                    {/* logout */}
                    {localToken ? (
                      <>
                        <li className="nav-item ">
                          <span
                            onClick={this.OnLogout.bind(this, dispatch)}
                            className="nav-link text-light mb-2"
                            style={{ cursor: "pointer", fontSize: 16 }}
                          >
                            Logout
                          </span>
                        </li>
                        {user && user.role !== "admin" ? (
                          <li className="nav-item ">
                            <Link
                              to="/profile"
                              className="nav-link text-light "
                              style={{ cursor: "pointer", fontSize: 16 }}
                            >
                              {user.name}
                            </Link>
                          </li>
                        ) : (
                          <li className="nav-item ">
                            <div
                              className="nav-link text-light "
                              style={{ fontSize: 16 }}
                            >
                              {user.name}
                            </div>
                          </li>
                        )}
                      </>
                    ) : (
                      // signup or sign in
                      <>
                        <li className="nav-item ">
                          <Link
                            to="/signup"
                            className="nav-link text-light "
                            style={{ cursor: "pointer", fontSize: 16 }}
                          >
                            SignUp
                          </Link>
                        </li>
                        <li className="nav-item ">
                          <Link
                            to="/login"
                            className="nav-link text-light "
                            style={{ cursor: "pointer", fontSize: 16 }}
                          >
                            Login
                          </Link>
                        </li>
                      </>
                    )}
                    <li>
                      <Link
                        to="/contactUs"
                        className="nav-link text-light "
                        style={{ cursor: "pointer", fontSize: 16 }}
                      >
                        Contact Us
                      </Link>
                    </li>
                  </div>
                </div>
              </nav>
            </>
          );
        }}
      </Consumer>
    );
  }
}

export default Header;
