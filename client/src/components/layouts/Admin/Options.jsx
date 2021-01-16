import axios from "axios";
import React, { Component } from "react";
import AdminSidePanel from "./AdminSidePanel";
import toast from "toasted-notes";
import "toasted-notes/src/styles.css";
import { Consumer } from "../../../context";
import { Redirect } from "react-router-dom";

export default class Options extends Component {
  constructor() {
    super();

    this.state = {
      teamName: "",
      roleName: "",

      existingTeamList: [],
      existingRoleList: [],

      error: "",
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

  // onDeleteAdminAccount = async (dispatch) => {
  //   const adminId = localStorage.getItem("userId");

  //   try {
  //     await axios.delete(`/api/admin/deleteAdminAcc/${adminId}`);
  //     console.log("deleted admin acc");
  //     localStorage.setItem("auth-token", "");
  //     localStorage.setItem("userId", "");

  //     dispatch({
  //       type: "LOGGED_OUT",
  //     });

  //     this.props.history.push("/login");
  //   } catch (err) {
  //     console.log(err.response.data);
  //   }
  // };

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
            <div className="row m-0">
              {/* left part */}
              <div className="col-2 p-0 leftPart">
                <AdminSidePanel />
              </div>

              {/* right part */}

              <div className="col rightPart container ">
                <div className="row">
                  <div className="col">
                    <form
                      className="addEmpForm"
                      style={{
                        width: "50%",
                        marginLeft: "auto",
                        marginRight: "auto",
                      }}
                    >
                      {this.state.error ? (
                        <div className="alert alert-danger">
                          {this.state.error}
                        </div>
                      ) : null}

                      <h2>Add new Teams and Roles</h2>
                      <hr />

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
                      {/* add new team */}

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

                {/* <div className="row mt-3">
                  <div
                    className="col"
                    style={{ display: "flex", justifyContent: "center" }}
                  >
                    <input
                      type="button"
                      className="btn btn-danger"
                      value="Delete Admin Account"
                      onClick={() => this.onDeleteAdminAccount(dispatch)}
                    />
                  </div>
                </div> */}
              </div>
            </div>
          );
        }}
      </Consumer>
    );
  }
}
