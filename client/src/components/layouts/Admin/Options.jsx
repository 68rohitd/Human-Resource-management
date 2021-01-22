import axios from "axios";
import React, { Component } from "react";
import AdminSidePanel from "./AdminSidePanel";
import toast from "toasted-notes";
import "toasted-notes/src/styles.css";
import { Consumer } from "../../../context";
import { Redirect } from "react-router-dom";
import { Spring } from "react-spring/renderprops";

export default class Options extends Component {
  constructor() {
    super();

    this.state = {
      teamName: "",
      roleName: "",

      existingTeamList: [],
      existingRoleList: [],

      error: "",

      // google calender
      title: "",
      description: "",
      dueDate: "",
      time: "",
    };
  }

  componentDidMount = async () => {
    const teamList = await axios.get("/api/admin/getTeamsAndRoles");
    console.log(teamList.data[0]);

    this.setState({
      existingTeamList: teamList.data[0].teamNames,
      existingRoleList: teamList.data[0].roleNames,
    });
  };

  onChange = (e) =>
    this.setState({ [e.target.name]: e.target.value, error: "" });

  onAddTeam = async () => {
    // check if team name already exists
    const { existingTeamList } = this.state;
    const { teamName } = this.state;

    if (teamName.trim().length === 0) {
      this.setState({
        error: "Team name cannot be empty",
      });
    } else if (existingTeamList.includes(teamName.trim())) {
      this.setState({
        error: "Team name already exists",
      });
    } else {
      // save the new team
      const newTeam = await axios.post("/api/admin/addNewTeam", {
        teamName: this.state.teamName,
      });

      this.setState({ existingTeamList: newTeam.data.teamNames });

      toast.notify("New team added successfully", {
        position: "top-right",
      });

      console.log("added new team: ", newTeam.data);
    }
  };

  onAddRole = async () => {
    // check if team name already exists
    const { existingRoleList } = this.state;
    const { roleName } = this.state;

    if (roleName.trim().length === 0) {
      this.setState({
        error: "Role name cannot be empty",
      });
    } else if (existingRoleList.includes(roleName.trim())) {
      this.setState({
        error: "Role name already exists",
      });
    } else {
      // save the new Role
      const newRole = await axios.post("/api/admin/addNewRole", {
        roleName: this.state.roleName,
      });

      toast.notify("New role added successfully", {
        position: "top-right",
      });

      this.setState({ existingRoleList: newRole.data.roleNames });

      console.log("added new role: ", newRole.data);
    }
  };

  onDeleteAdminAccount = async (dispatch) => {
    const adminId = localStorage.getItem("userId");

    try {
      await axios.delete(`/api/admin/deleteAdminAcc/${adminId}`);
      console.log("deleted admin acc");
      localStorage.setItem("auth-token", "");
      localStorage.setItem("userId", "");

      dispatch({
        type: "LOGGED_OUT",
      });

      this.props.history.push("/login");
    } catch (err) {
      console.log(err.response.data);
    }
  };

  addToGoogleCalender = (e) => {
    e.preventDefault();

    try {
      var gapi = window.gapi;
      console.log(gapi);
      var CLIENT_ID =
        "487679379915-7rvf2ror46e4bbsj8t8obali4heq5qjm.apps.googleusercontent.com";
      var API_KEY = "AIzaSyB_HYziuQ7j6s9CiqSgXV3YiGTzr5nc0xE";
      var DISCOVERY_DOCS = [
        "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
      ];
      var SCOPES = "https://www.googleapis.com/auth/calendar.events";

      gapi.load("client:auth2", () => {
        console.log("loaded client");

        gapi.client.init({
          apiKey: API_KEY,
          clientId: CLIENT_ID,
          discoveryDocs: DISCOVERY_DOCS,
          scope: SCOPES,
        });

        gapi.client.load("calendar", "v3", () =>
          console.log("loaded calender")
        );

        gapi.auth2
          .getAuthInstance()
          .signIn()
          .then(() => {
            var event = {
              summary: this.state.title,
              description: this.state.description,
              start: {
                dateTime: `${this.state.dueDate}T${this.state.time}:00`,
                timeZone: "Asia/Kolkata",
              },
              end: {
                dateTime: `${this.state.dueDate}T${this.state.time}:00`,
                timeZone: "Asia/Kolkata",
              },
              reminders: {
                useDefault: false,
                overrides: [
                  { method: "email", minutes: 24 * 60 },
                  { method: "popup", minutes: 10 },
                ],
              },
            };

            var request = gapi.client.calendar.events.insert({
              calendarId: "primary",
              resource: event,
            });

            console.log("add new event from addTodo");

            request.execute((event) => {
              console.log(event);
            });

            toast.notify("Successfully set reminder to your Google Calender", {
              position: "top-right",
            });
          });
      });
    } catch (e) {
      console.log(e);
    }
  };

  render() {
    return (
      <Consumer>
        {(value) => {
          let { dispatch, user } = value;

          const token = localStorage.getItem("auth-token");

          if (!token) return <Redirect to="/login" />;
          if (user && user.role !== "admin")
            return <Redirect to="/empDashBoard" />;

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
                    <AdminSidePanel />
                  </div>

                  {/* right part */}

                  <div className="col rightPart container" style={props}>
                    <div className="row">
                      {/* add roles, teams */}
                      <div className="col">
                        <div className="row">
                          <div className="col">
                            <form className="addEmpForm">
                              {this.state.error ? (
                                <div className="alert alert-danger">
                                  {this.state.error}
                                </div>
                              ) : null}

                              <h3>Add new Teams and Roles</h3>
                              <hr />
                              {/* add new team */}

                              <label htmlFor="team">New Team</label>
                              <div className="input-group mb-3">
                                <input
                                  type="text"
                                  className="form-control"
                                  value={this.state.teamName}
                                  name="teamName"
                                  aria-label="Recipient's username"
                                  aria-describedby="button-addon2"
                                  onChange={this.onChange}
                                />

                                <div className="input-group-append">
                                  <button
                                    className="btn btn-primary"
                                    type="button"
                                    id="button-addon2"
                                    onClick={this.onAddTeam}
                                  >
                                    Add
                                  </button>
                                </div>
                              </div>

                              {/* add new role */}
                              <label htmlFor="team">New Role</label>
                              <div className="input-group mb-3">
                                <input
                                  type="text"
                                  className="form-control"
                                  value={this.state.roleName}
                                  name="roleName"
                                  aria-label="Recipient's username"
                                  aria-describedby="button-addon2"
                                  onChange={this.onChange}
                                />

                                <div className="input-group-append">
                                  <button
                                    className="btn btn-primary"
                                    type="button"
                                    id="button-addon2"
                                    onClick={this.onAddRole}
                                  >
                                    Add
                                  </button>
                                </div>
                              </div>
                            </form>
                          </div>
                        </div>

                        <div className="row mt-5 ml-3">
                          <div className="col">
                            <input
                              type="button"
                              className="btn btn-danger"
                              value="Delete Admin Account"
                              onClick={() =>
                                this.onDeleteAdminAccount(dispatch)
                              }
                            />

                            <div className="alert alert-danger mt-3">
                              <small>
                                <b>Note: </b> By deleting admin account, you
                                will loose all your current pending requests,
                                which might lead to adverse effects. Therefore
                                it is recommended you delete the account once
                                clearing all the requests
                              </small>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* google calender  */}
                      <div className="col">
                        <form
                          onSubmit={this.addToGoogleCalender.bind(this)}
                          className="addEmpForm"
                        >
                          <h3>
                            Add Reminder{" "}
                            <i className="fab fa-google text-dark"></i>{" "}
                          </h3>
                          <hr />

                          <div className="row">
                            <div className="col">
                              <div className="form-group">
                                <label htmlFor="title">Title</label>
                                <input
                                  required
                                  type="text"
                                  className="form-control"
                                  id="title"
                                  name="title"
                                  onChange={this.onChange}
                                />
                              </div>
                            </div>
                          </div>

                          <div className="row">
                            <div className="col">
                              <div className="form-group">
                                <label htmlFor="description">Description</label>
                                <textarea
                                  required
                                  type="text"
                                  className="form-control"
                                  id="description"
                                  name="description"
                                  onChange={this.onChange}
                                />
                              </div>
                            </div>
                          </div>

                          <div className="row">
                            <div className="col">
                              <div className="form-group">
                                <label htmlFor="dueDate">Due Date</label>
                                <input
                                  required
                                  type="date"
                                  className="form-control"
                                  id="dueDate"
                                  name="dueDate"
                                  onChange={this.onChange}
                                />
                              </div>
                            </div>

                            <div className="col">
                              <div className="form-group">
                                <label htmlFor="time">Time</label>
                                <input
                                  required
                                  type="time"
                                  className="form-control"
                                  id="time"
                                  name="time"
                                  onChange={this.onChange}
                                />
                              </div>
                            </div>
                          </div>

                          <div className="row">
                            <div className="col">
                              <div className="form-group">
                                <input
                                  type="submit"
                                  value="Submit"
                                  className="btn btn-primary btn-block "
                                />
                              </div>
                            </div>
                          </div>
                        </form>
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
