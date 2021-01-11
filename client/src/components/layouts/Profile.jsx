import React, { Component } from "react";
// import "../../assets/profile-styles/Profile.css";
import profilePic from "../../assets/profile-styles/userPic.png";
import Axios from "axios";
import { Consumer } from "../../context";
import axios from "axios";
import toast from "toasted-notes";
import "toasted-notes/src/styles.css";

export default class Profile extends Component {
  constructor() {
    super();
    this.state = {
      readOnly: true,

      //form
      id: "",
      name: "",
      phoneNo: "",
      email: "",
      address: "",
      role: "",
      team: "",
      objective: "",
      skills: "",
      doj: "",

      // pwd
      onShowChangePassword: false,
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",

      // error
      error: "",
    };
  }

  async componentDidMount() {
    const token = localStorage.getItem("auth-token");
    const res = await Axios.get("/api/users", {
      headers: { "x-auth-token": token },
    });

    console.log("profile: ", res.data.user);
    this.setState({
      id: res.data.user._id,
      name: res.data.user.name,
      address: res.data.user.address,
      email: res.data.user.email,
      role: res.data.user.role,
      team: res.data.user.team,
      phoneNo: res.data.user.phoneNo,
      objective: res.data.user.objective,
      skills: res.data.user.skills,
      doj: res.data.user.doj,
    });
  }

  updateProfile = () => {
    this.setState(
      {
        readOnly: !this.state.readOnly,
      },
      this.sendData
    );
  };

  sendData = async () => {
    if (this.state.readOnly) {
      const updatedUser = {
        name: this.state.name,
        email: this.state.email,
        address: this.state.address,
        role: this.state.role,
        phoneNo: this.state.phoneNo,
        team: this.state.team,
        objective: this.state.objective,
        skills: this.state.skills,
        doj: this.state.doj,
      };

      const res = await Axios.post("/api/users/updateProfile", {
        user: updatedUser,
        id: this.state.id,
      });
      console.log(res.data);
    }
  };

  onRadioChange = (e) => this.setState({ fresher: !this.state.fresher });

  onChangePassword = async () => {
    const oldPassword = this.state.oldPassword.trim();
    const newPassword = this.state.newPassword.trim();
    const confirmPassword = this.state.confirmPassword.trim();

    const empId = localStorage.getItem("userId");

    if (newPassword !== confirmPassword) {
      this.setState({ error: "new and old password dont match" });
    } else {
      try {
        await axios.put(`/api/users/changePassword/${empId}`, {
          oldPassword,
          newPassword,
        });

        toast.notify("successfully changed the password", {
          position: "top-right",
        });

        console.log("successfully changed password");
      } catch (e) {
        this.setState({
          error: e.response.data.msg,
        });
        console.log(e.response.data.msg);
      }
    }
  };

  onChange = (e) =>
    this.setState({ [e.target.name]: e.target.value, error: "" });

  render() {
    return (
      <Consumer>
        {(value) => {
          return (
            <>
              <div className="wrapper jumbotron mt-4">
                <div className="left">
                  <img src={profilePic} alt="user" width="150" />
                  <h4>
                    <div className="form-group">
                      <input
                        className="mys"
                        disabled={this.state.readOnly}
                        name="name"
                        type="text"
                        id="name"
                        size="2"
                        style={{ color: "white" }}
                        value={this.state.name}
                        onChange={this.onChange}
                      />
                    </div>
                  </h4>

                  <h1>
                    <div>
                      <input
                        disabled={this.state.readOnly}
                        className="form-control mys"
                        style={{ size: 200 }}
                        placeholder="Objective"
                        name="objective"
                        id="objective"
                        onChange={this.onChange}
                        value={this.state.objective}
                      />
                    </div>
                  </h1>

                  <input
                    className="btn btn-primary mys"
                    type="button"
                    onClick={this.updateProfile}
                    value={this.state.readOnly ? "Edit" : "Save"}
                  />
                </div>
                <div className="right">
                  <div className="info">
                    <h3>Basic Information</h3>
                    <div className="info_data">
                      <div className="container">
                        <div className="row">
                          <div className="col">
                            <div className="data">
                              <h4>Email</h4>
                              <div className="form-group">
                                <input
                                  className="mys"
                                  disabled={this.state.readOnly}
                                  type="email"
                                  name="email"
                                  id="email"
                                  aria-describedby="emailHelp"
                                  value={this.state.email}
                                  onChange={this.onChange}
                                />
                              </div>
                            </div>
                          </div>

                          <div className="col">
                            <div className="data">
                              <h4>Phone</h4>
                              <div className="form-group">
                                <input
                                  className="mys"
                                  disabled={this.state.readOnly}
                                  type="phoneNo"
                                  name="phoneNo"
                                  id="phoneNo"
                                  aria-describedby="phoneNo"
                                  value={this.state.phoneNo}
                                  onChange={this.onChange}
                                />
                              </div>
                            </div>
                          </div>

                          <div className="col">
                            <div className="data">
                              <h4>Date Of Joining</h4>
                              <div className="form-group">
                                <input
                                  className="mys"
                                  disabled={true}
                                  type="date"
                                  name="doj"
                                  id="doj"
                                  value={this.state.doj}
                                  onChange={this.onChange}
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="row">
                          <div className="col">
                            <div className="data">
                              <h4>Address</h4>
                              <div className="form-group">
                                <input
                                  className="mys"
                                  disabled={this.state.readOnly}
                                  type="text"
                                  name="address"
                                  id="address"
                                  value={this.state.address}
                                  onChange={this.onChange}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="projects">
                    <h3>Company Profile</h3>
                    <div className="projects_data">
                      <div className="container">
                        <div className="row">
                          <div className="col">
                            <div className="data">
                              <h4>Team</h4>
                              <div className="form-group">
                                <input
                                  className="mys"
                                  disabled={true}
                                  type="team"
                                  name="team"
                                  id="team"
                                  aria-describedby="team"
                                  value={this.state.team}
                                  onChange={this.onChange}
                                />
                              </div>
                            </div>
                          </div>

                          <div className="col">
                            <div className="data">
                              <h4>Role</h4>
                              <div className="form-group">
                                <input
                                  className="mys"
                                  disabled={true}
                                  type="text"
                                  name="role"
                                  id="role"
                                  value={this.state.role}
                                  onChange={this.onChange}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="col">
                            <div className="data">
                              <h4>Skills</h4>
                              <div className="form-group">
                                <input
                                  disabled={this.state.readOnly}
                                  className="mys"
                                  type="text"
                                  name="skills"
                                  id="skills"
                                  value={this.state.skills}
                                  onChange={this.onChange}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row m-0 changePassword">
                <input
                  type="button"
                  value="change password"
                  className="btn btn-primary"
                  onClick={() =>
                    this.setState({
                      onShowChangePassword: !this.state.onShowChangePassword,
                    })
                  }
                />

                {this.state.onShowChangePassword ? (
                  <>
                    {this.state.error ? (
                      <div className="alert alert-danger">
                        {this.state.error}
                      </div>
                    ) : null}

                    <label htmlFor="prevPassword">enter old pass</label>
                    <input
                      type="text"
                      name="oldPassword"
                      value={this.state.oldPassword}
                      onChange={this.onChange}
                    />

                    <label htmlFor="newPassword">enter new pass</label>
                    <input
                      type="text"
                      name="newPassword"
                      value={this.state.newPassword}
                      onChange={this.onChange}
                    />

                    <label htmlFor="confirmPassword">confirm new pass</label>
                    <input
                      type="text"
                      name="confirmPassword"
                      value={this.state.confirmPassword}
                      onChange={this.onChange}
                    />

                    <input
                      type="button"
                      value="submit"
                      onClick={this.onChangePassword}
                    />
                  </>
                ) : null}
              </div>
            </>
          );
        }}
      </Consumer>
    );
  }
}
