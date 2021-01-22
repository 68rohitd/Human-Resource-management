import React, { Component } from "react";
import "../../assets/profile-styles/Profile.css";
import maleProfilePic from "../../assets/view-emp/maleUserPic.png";
import femaleProfilePic from "../../assets/view-emp/femaleUserPic.png";
import Axios from "axios";
import { Consumer } from "../../context";
import axios from "axios";
import toast from "toasted-notes";
import "toasted-notes/src/styles.css";
import { Redirect } from "react-router-dom";
import EmpSidePanel from "./Employee/EmpSidePanel";
import LoanDetailsCard from "./Admin/LoanDetailsCard";
import { Spring } from "react-spring/renderprops";

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
      gender: "",

      // pwd
      // onShowChangePassword: false,
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",

      // error
      error: "",

      // loan history
      empLoanHistory: [],
    };
  }

  async componentDidMount() {
    const token = localStorage.getItem("auth-token");
    const userId = localStorage.getItem("userId");

    // getting user data
    const res = await Axios.get("/api/users", {
      headers: { "x-auth-token": token },
    });

    // getting user sal data to get total leaves used
    const userSalData = await axios.get(
      `/api/admin/getUserSalDetails/${userId}`
    );

    // getting emp loan history
    const empLoanHistory = await axios.get(
      `/api/admin/getEmpLoanHistory/${userId}`
    );

    console.log("profile: ", res.data.user);
    console.log("emp sal details: ", userSalData.data);
    console.log("emp loan details: ", empLoanHistory.data);

    this.setState({
      // profile
      id: res.data.user._id,
      name: res.data.user.name,
      address: res.data.user.address,
      email: res.data.user.email,
      role: res.data.user.role,
      team: res.data.user.team,
      phoneNo: res.data.user.phoneNo,
      objective: res.data.user.objective,
      skills: res.data.user.skills,
      gender: res.data.user.gender,
      doj: res.data.user.doj,

      // loan details
      empLoanHistory: empLoanHistory.data,
    });
  }

  onGetDate = (date) => {
    const d = new Date(date);
    let returnDate = d.toLocaleDateString("en-GB");
    return returnDate;
  };

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
        gender: this.state.gender,
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

        this.setState({
          onShowChangePassword: false,
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
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
    const {
      name,
      email,
      phoneNo,
      skills,
      team,
      role,
      address,
      objective,
      gender,
      doj,
    } = this.state;

    return (
      <Consumer>
        {(value) => {
          let { user } = value;
          const token = localStorage.getItem("auth-token");
          if (!token) return <Redirect to="/login" />;

          if (user && user.role === "admin") return <Redirect to="/" />;

          return (
            <Spring
              from={{ opacity: 0 }}
              to={{ opacity: 1 }}
              config={{ duration: 300 }}
            >
              {(props) => (
                <div className="row m-0">
                  {/* left part */}
                  <div className="col-2 p-0 leftPart">
                    <EmpSidePanel />
                  </div>

                  {/* right part */}
                  <div className="col rightPart" style={props}>
                    <div className="row  p-5 ">
                      {/* details col */}
                      <div className="col detailsCol">
                        <h3>User Details</h3>
                        <hr />

                        <div className="container">
                          <div className="row my-4">
                            <div className="col">
                              <span>Name</span>
                              {!this.state.readOnly ? (
                                <input
                                  disabled={this.state.readOnly}
                                  type="text"
                                  name="name"
                                  value={name}
                                  onChange={this.onChange}
                                  className="form-control"
                                />
                              ) : (
                                <h6>{name}</h6>
                              )}
                            </div>
                            <div className="col">
                              <span>Email</span>
                              {!this.state.readOnly ? (
                                <input
                                  disabled={this.state.readOnly}
                                  type="email"
                                  name="email"
                                  value={email}
                                  onChange={this.onChange}
                                  className="form-control"
                                />
                              ) : (
                                <h6>{email}</h6>
                              )}
                            </div>
                            <div className="col">
                              <span>Phone No.</span>
                              {!this.state.readOnly ? (
                                <input
                                  disabled={this.state.readOnly}
                                  type="number"
                                  name="phoneNo"
                                  value={phoneNo}
                                  onChange={this.onChange}
                                  className="form-control"
                                />
                              ) : (
                                <h6>{phoneNo}</h6>
                              )}
                            </div>
                          </div>

                          <div className="row my-4">
                            <div className="col">
                              <span>Address</span>
                              {!this.state.readOnly ? (
                                <input
                                  disabled={this.state.readOnly}
                                  type="text"
                                  name="address"
                                  value={address}
                                  onChange={this.onChange}
                                  className="form-control"
                                />
                              ) : (
                                <h6>{address}</h6>
                              )}
                            </div>
                            <div className="col">
                              <span>Skills</span>
                              {!this.state.readOnly ? (
                                <textarea
                                  disabled={this.state.readOnly}
                                  type="text"
                                  name="skills"
                                  value={skills}
                                  onChange={this.onChange}
                                  className="form-control"
                                />
                              ) : (
                                <h6>{skills}</h6>
                              )}
                            </div>
                            <div className="col"></div>
                          </div>
                        </div>

                        <h3>Company Details</h3>
                        <hr />

                        <div className="container">
                          <div className="row">
                            <div className="col">
                              <span>Date Of Joining</span>
                              <h6>{doj}</h6>
                            </div>
                            <div className="col">
                              <span>Team</span>
                              <h6>{team}</h6>
                            </div>
                            <div className="col">
                              <span>Role</span>
                              <h6>{role}</h6>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* profile pic col */}
                      <div className="col-3 profilePicCol">
                        <div className="row">
                          {/* condition to avoid gender flicker */}
                          {gender ? (
                            <img
                              className="userPic"
                              src={
                                gender === "Male"
                                  ? maleProfilePic
                                  : femaleProfilePic
                              }
                              alt=""
                              width="100px"
                            />
                          ) : null}
                        </div>

                        <div className="row">
                          <div className="col m-3 objective">
                            {!this.state.readOnly ? (
                              <textarea
                                disabled={this.state.readOnly}
                                type="text"
                                placeholder="My Objective"
                                value={objective}
                                onChange={this.onChange}
                                name="objective"
                                className="form-control"
                              />
                            ) : (
                              <h6 className="text-center">
                                <i>{objective}</i>
                              </h6>
                            )}
                          </div>
                        </div>

                        <div className="row">
                          <div
                            className="col"
                            style={{
                              display: "flex",
                              justifyContent: "center",
                            }}
                          >
                            <input
                              type="button"
                              value={
                                this.state.readOnly
                                  ? "Edit Profile"
                                  : "Save Profile"
                              }
                              className="btn btn-primary btn-sm"
                              onClick={this.updateProfile}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="row">
                      {/* change password */}
                      <div className="col">
                        {/* password form */}
                        <div className="container addEmpForm">
                          <h3>Change Password</h3>
                          <hr />

                          {this.state.error ? (
                            <div className="alert alert-danger">
                              {this.state.error}
                            </div>
                          ) : null}

                          <form>
                            <div className="row">
                              <div className="col">
                                <div className="form-group">
                                  <label htmlFor="prevPassword">
                                    Enter old password
                                  </label>
                                  <input
                                    required
                                    className="form-control"
                                    type="password"
                                    name="oldPassword"
                                    value={this.state.oldPassword}
                                    onChange={this.onChange}
                                  />
                                </div>
                              </div>
                            </div>

                            <div className="row mb-4">
                              <div className="col">
                                <div className="form-group">
                                  <label htmlFor="newPassword">
                                    Enter new password
                                  </label>
                                  <input
                                    required
                                    className="form-control"
                                    type="password"
                                    name="newPassword"
                                    value={this.state.newPassword}
                                    onChange={this.onChange}
                                  />
                                </div>
                              </div>
                              <div className="col">
                                <div className="form-group">
                                  <label htmlFor="confirmPassword">
                                    Confirm new password
                                  </label>
                                  <input
                                    required={true}
                                    className="form-control"
                                    type="password"
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={this.state.confirmPassword}
                                    onChange={this.onChange}
                                  />
                                </div>
                              </div>
                            </div>

                            <div className="row">
                              <div className="col">
                                <input
                                  className="btn btn-primary"
                                  type="button"
                                  value="Change Password"
                                  onClick={this.onChangePassword}
                                />
                              </div>
                            </div>
                          </form>
                        </div>
                      </div>

                      {/* loan history */}
                      <div className="col mb-5">
                        <div className="row">
                          <div className="col">
                            {this.state.empLoanHistory.length ? (
                              <form
                                className="addEmpForm"
                                style={{ height: "460px", overflowY: "scroll" }}
                              >
                                <h3>Employee Loan History</h3>
                                <hr />

                                {this.state.empLoanHistory.map((loan) => (
                                  <LoanDetailsCard
                                    key={loan.reqId}
                                    isAdmin={
                                      user && user.role === "admin"
                                        ? true
                                        : false
                                    }
                                    loanDetails={loan}
                                    onGetDate={this.onGetDate}
                                    onMarkAsPaid={this.onMarkAsPaid}
                                  />
                                ))}
                              </form>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </Spring>
          );
        }}
      </Consumer>
    );
  }
}
