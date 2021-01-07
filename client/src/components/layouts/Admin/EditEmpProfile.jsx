import axios from "axios";
import React, { Component } from "react";

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

      // sal details
      basicPay: userSalData.data.basicPay,
      totalLeaves: userSalData.data.totalLeaves,
      travelAllowance: userSalData.data.travelAllowance,
      medicalAllowance: userSalData.data.medicalAllowance,
      salary: userSalData.data.salary,
    });
  }

  onDelete = async () => {
    const deletedEmp = await axios.delete(`/api/admin/delete/${this.state.id}`);
    console.log("deleted: ", deletedEmp.data);
    this.props.history.push("/viewEmployees");
  };

  updateProfile = async () => {
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

    const res = await axios.post("/api/users/updateProfile", {
      user: updatedUser,
      id: this.state.id,
    });
    console.log(res.data);
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
    console.log(res.data);
  };

  onSelectGender = (gender) => this.setState({ gender });

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
      <div>
        <div className="row m-0">
          <div className="container mt-3 form">
            <form className="py-2">
              <h4>Employee Profile</h4>
              <div className="row mt-3">
                <div className="col">
                  <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input
                      name="name"
                      type="text"
                      className="form-control"
                      id="name"
                      value={this.state.name}
                      onChange={this.onChange}
                    />
                  </div>
                </div>
              </div>

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

              <div className="form-group">
                <label htmlFor="email">Email address</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  id="email"
                  aria-describedby="emailHelp"
                  value={this.state.email}
                  onChange={this.onChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="phoneNo">phoneNo</label>
                <input
                  type="phoneNo"
                  name="phoneNo"
                  className="form-control"
                  id="phoneNo"
                  aria-describedby="phoneNo"
                  value={this.state.phoneNo}
                  onChange={this.onChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="doj">Date of Joining</label>
                <input
                  type="date"
                  name="doj"
                  className="form-control"
                  id="doj"
                  value={this.state.doj}
                  onChange={this.onChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="team">team</label>
                <input
                  type="team"
                  name="team"
                  className="form-control"
                  id="team"
                  aria-describedby="team"
                  value={this.state.team}
                  onChange={this.onChange}
                />
              </div>

              <div className="row">
                <div className="col">
                  <div className="form-group">
                    <label htmlFor="address">address</label>
                    <input
                      type="text"
                      name="address"
                      className="form-control"
                      id="address"
                      value={this.state.address}
                      onChange={this.onChange}
                    />
                  </div>
                </div>

                <div className="col">
                  <div className="form-group">
                    <label htmlFor="role">Role</label>
                    <input
                      type="text"
                      name="role"
                      className="form-control"
                      id="role"
                      value={this.state.role}
                      onChange={this.onChange}
                    />
                  </div>
                </div>
              </div>

              <input
                type="button"
                className="btn btn-primary "
                onClick={this.updateProfile}
                value="update profile"
              />

              <input
                type="button"
                className="btn btn-primary "
                onClick={this.onDelete}
                value="delete emp profile"
              />
            </form>
          </div>
        </div>

        <hr />

        {/* salary details */}
        <div className="row m-0">
          <div className="container">
            <form className="py-2">
              <h4>Salary details</h4>
              <div className="form-group">
                <label htmlFor="name">basic pay</label>
                <input
                  name="basicPay"
                  type="text"
                  className="form-control"
                  id="basicPay"
                  value={this.state.basicPay}
                  onChange={this.onChange}
                />
              </div>

              <p>Total leaves: {this.state.totalLeaves}</p>

              <div className="form-group">
                <label htmlFor="name">travel allowance</label>
                <input
                  name="travelAllowance"
                  type="text"
                  className="form-control"
                  id="travelAllowance"
                  value={this.state.travelAllowance}
                  onChange={this.onChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="name">medical allowance</label>
                <input
                  name="medicalAllowance"
                  type="text"
                  className="form-control"
                  id="medicalAllowance"
                  value={this.state.medicalAllowance}
                  onChange={this.onChange}
                />
              </div>

              <input
                type="button"
                className="btn btn-primary "
                onClick={this.calSal}
                value="cal sal"
              />
              <p>
                <b>{this.state.salary}</b>
              </p>

              <input
                type="button"
                className="btn btn-primary "
                onClick={this.updateSalDetails}
                value="update sal details"
              />
            </form>
          </div>
        </div>
      </div>
    );
  }
}
