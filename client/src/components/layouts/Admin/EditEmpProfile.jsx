import axios from "axios";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import toast from "toasted-notes";
import "toasted-notes/src/styles.css";

export default class EditEmpProfile extends Component {
  constructor() {
    super();
    this.state = {
      //form
      id: "",
      name: "",
      phoneNo: "",
      email: "",
      gender: "",
      address: "",
      role: "",
      team: "",
      doj: "",

      // teams and roels
      teamList: [],
      roleList: [],

      // sal details
      basicPay: "",
      totalLeaves: "",
      travelAllowance: "",
      medicalAllowance: "",
      salary: "",
    };
  }

  async componentDidMount() {
    const userId = this.props.match.params.id;

    const userData = await axios.get(`/api/admin/getUserData/${userId}`);
    const userSalData = await axios.get(
      `/api/admin/getUserSalDetails/${userId}`
    );
    const teamAndRoleList = await axios.get("/api/admin/getTeamsAndRoles");

    this.setState({
      // form
      id: userData.data._id,
      name: userData.data.name,
      address: userData.data.address,
      gender: userData.data.gender,
      email: userData.data.email,
      role: userData.data.role,
      team: userData.data.team,
      phoneNo: userData.data.phoneNo,
      objective: userData.data.objective,
      doj: userData.data.doj,

      teamList: teamAndRoleList.data[0].teamNames,
      roleList: teamAndRoleList.data[0].roleNames,

      // sal details
      basicPay: userSalData.data.basicPay,
      totalLeaves: userSalData.data.totalLeaves,
      travelAllowance: userSalData.data.travelAllowance,
      medicalAllowance: userSalData.data.medicalAllowance,
      salary: userSalData.data.salary,
    });
  }

  onDelete = async () => {
    try {
      const adminId = localStorage.getItem("userId");
      const deletedEmp = await axios.delete(
        `/api/admin/delete/${this.state.id}`,
        {
          data: {
            adminId: adminId,
          },
        }
      );

      toast.notify("Deleted profile successfully", {
        position: "top-right",
      });

      console.log("deleted: ", deletedEmp.data);
      this.props.history.push("/viewEmployees");
    } catch (e) {
      console.log("Error", e);
    }
  };

  updateProfile = async (e) => {
    e.preventDefault();

    const updatedUser = {
      name: this.state.name,
      email: this.state.email,
      gender: this.state.gender,
      address: this.state.address,
      role: this.state.role,
      phoneNo: this.state.phoneNo,
      team: this.state.team,
      objective: this.state.objective,
      doj: this.state.doj,
    };

    try {
      const res = await axios.post("/api/users/updateProfile", {
        user: updatedUser,
        id: this.state.id,
      });

      toast.notify("Updated profile", {
        position: "top-right",
      });

      console.log(res.data);
    } catch (e) {
      console.log("Error: ", e);
    }
  };

  updateSalDetails = async () => {
    const updatedSal = {
      basicPay: this.state.basicPay,
      totalLeaves: this.state.totalLeaves,
      travelAllowance: this.state.travelAllowance,
      medicalAllowance: this.state.medicalAllowance,
      salary: this.state.salary,
    };

    const res = await axios.put(
      `/api/admin/updateSalaryDetails/${this.state.id}`,
      {
        salDetails: updatedSal,
      }
    );

    toast.notify("Updated salary details", {
      position: "top-right",
    });

    console.log(res.data);
  };

  onSelectGender = (gender) => this.setState({ gender });

  onTeamSelect = (team) => this.setState({ team });

  onRoleSelect = (role) => this.setState({ role });
  calSal = (e) => {
    e.preventDefault();
    let totalSal = 0;
    const {
      basicPay,
      totalLeaves,
      travelAllowance,
      medicalAllowance,
    } = this.state;

    totalSal =
      parseInt(basicPay) +
      parseInt(travelAllowance) +
      parseInt(medicalAllowance);

    const perDaySal = totalSal / 30;
    if (totalLeaves > 3) {
      totalSal -= parseInt((totalLeaves - 3) * perDaySal);
    }
    this.setState({ salary: totalSal });
  };

  onChange = (e) => this.setState({ [e.target.name]: e.target.value });

  render() {
    return (
      <div className="container">
        <div className="row m-0">
          {/* form */}
          <div className="col">
            <form
              className="addEmpForm"
              onSubmit={this.updateProfile.bind(this)}
            >
              <h3>Employee Profile</h3>
              <hr />

              <div className="row">
                <div className="col">
                  {/* name */}
                  <label htmlFor="name">Name</label>
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    value={this.state.name}
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
                    value={this.state.email}
                    className="form-control mb-3 "
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
                    value={this.state.address}
                    id="address"
                    rows="1"
                    className="form-control mb-3 "
                    onChange={this.onChange}
                    required
                  />
                </div>
                <div className="col">
                  {/* phone no */}
                  <label htmlFor="phoneNo">Phone No.</label>
                  <input
                    type="number"
                    value={this.state.phoneNo}
                    name="phoneNo"
                    className="form-control mb-3 "
                    onChange={this.onChange}
                    required
                  />
                </div>
              </div>

              <div className="row">
                {/* team */}
                <div className="col">
                  <label htmlFor="team">Team</label>
                  <div className="dropdown">
                    <button
                      className="btn btn-light dropdown-toggle"
                      type="button"
                      id="dropdownMenuButton"
                      data-toggle="dropdown"
                      aria-haspopup="true"
                      aria-expanded="false"
                    >
                      {this.state.team}
                    </button>
                    <div
                      className="dropdown-menu"
                      aria-labelledby="dropdownMenuButton"
                    >
                      {this.state.teamList.map((teamName) => (
                        <li
                          key={teamName}
                          className="dropdown-item"
                          onClick={() => this.onTeamSelect(teamName)}
                        >
                          {teamName}
                        </li>
                      ))}
                    </div>
                  </div>
                  {/* <input
                    type="text"
                    value={this.state.team}
                    name="team"
                    className="form-control mb-3 "
                    onChange={this.onChange}
                    required
                  /> */}
                </div>

                {/* role */}
                <div className="col">
                  <label htmlFor="role">Role</label>
                  <div className="dropdown mb-3">
                    <button
                      className="btn btn-light dropdown-toggle"
                      type="button"
                      id="dropdownMenuButton"
                      data-toggle="dropdown"
                      aria-haspopup="true"
                      aria-expanded="false"
                    >
                      {this.state.role}
                    </button>
                    <div
                      className="dropdown-menu"
                      aria-labelledby="dropdownMenuButton"
                    >
                      {this.state.roleList.map((roleName) => (
                        <li
                          key={roleName}
                          className="dropdown-item"
                          onClick={() => this.onRoleSelect(roleName)}
                        >
                          {roleName}
                        </li>
                      ))}
                    </div>
                  </div>

                  {/* <input
                    type="text"
                    name="role"
                    value={this.state.role}
                    className="form-control mb-3 "
                    onChange={this.onChange}
                    required
                  /> */}
                </div>
              </div>

              <div className="row">
                {/* doj */}
                <div className="col">
                  <label htmlFor="doj">Date Of Joining</label>
                  <input
                    type="date"
                    name="doj"
                    value={this.state.doj}
                    className="form-control mb-3 "
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
                          onClick={() => this.onSelectGender("Male")}
                        >
                          Male
                        </li>
                        <li
                          className="dropdown-item"
                          onClick={() => this.onSelectGender("Female")}
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

          {/* salary details */}
          <div className="col">
            <form className="addEmpForm">
              <h3>Employee Salary Details</h3>
              <hr />
              <div className="form-group">
                <label htmlFor="name">Basic Pay</label>
                <input
                  name="basicPay"
                  type="number"
                  className="form-control"
                  id="basicPay"
                  value={this.state.basicPay}
                  onChange={this.onChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="name">Travel Allowance</label>
                <input
                  name="travelAllowance"
                  type="number"
                  className="form-control"
                  id="travelAllowance"
                  value={this.state.travelAllowance}
                  onChange={this.onChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="name">mMdical Allowance</label>
                <input
                  name="medicalAllowance"
                  type="number"
                  className="form-control"
                  id="medicalAllowance"
                  value={this.state.medicalAllowance}
                  onChange={this.onChange}
                />
              </div>

              <p>Total leaves: {this.state.totalLeaves}</p>

              <div className="input-group mb-3">
                <input
                  type="text"
                  className="form-control"
                  disabled={true}
                  defaultValue={this.state.salary}
                  aria-label="Recipient's username"
                  aria-describedby="button-addon2"
                />
                <div className="input-group-append">
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    id="button-addon2"
                    onClick={this.calSal}
                  >
                    Calculate Salary
                  </button>
                </div>
              </div>

              <input
                type="button"
                className="btn btn-success btn-block"
                onClick={this.updateSalDetails}
                value="Update Salary Details"
              />
            </form>
          </div>

          <div className="col-1 mt-5">
            <input
              className="btn btn-danger"
              type="button"
              value="Delete profile"
              onClick={this.onDelete}
            />

            <Link to="/statistics">
              <input
                className="btn btn-success mt-3"
                type="button"
                value="Go to Dashboard"
              />
            </Link>
          </div>
        </div>
      </div>
    );
  }
}
