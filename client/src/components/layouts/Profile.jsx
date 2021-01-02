import React, { Component } from "react";
import "../../assets/profile-styles/Profile.css";
import profilePic from "../../assets/profile-styles/userPic.png";
import Axios from "axios";
import { Consumer } from "../../context";

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

  onChange = (e) => this.setState({ [e.target.name]: e.target.value });

  render() {
    return (
      <Consumer>
        {(value) => {
          return (
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
          );
        }}
      </Consumer>
    );
  }
}

// import React, { Component } from "react";
// import icon from "../../assets/profile-styles/userIcon.png";
// import { Consumer } from "../../context";
// import "../../assets/profile-styles/viewProfile.css";
// import Axios from "axios";
// // import { Link } from "react-router-dom";

// export default className Profile extends Component {
//   constructor() {
//     super();
//     this.state = {
//       readOnly: true,

//       //form
//       id: "",
//       name: "",
//       phoneNo: "",
//       email: "",
//       salary: "",
//       address: "",
//       role: "",
//       team: "",
//       objective: "",
//       skills: "",
//       doj: "",
//     };
//   }

//   async componentDidMount() {
//     const token = localStorage.getItem("auth-token");
//     const res = await Axios.get("/api/users", {
//       headers: { "x-auth-token": token },
//     });

//     console.log("profile: ", res.data.user);
//     this.setState({
//       id: res.data.user._id,
//       name: res.data.user.name,
//       address: res.data.user.address,
//       email: res.data.user.email,
//       role: res.data.user.role,
//       team: res.data.user.team,
//       salary: res.data.user.salary,
//       phoneNo: res.data.user.phoneNo,
//       objective: res.data.user.objective,
//       skills: res.data.user.skills,
//       doj: res.data.user.doj,
//     });
//   }

//   updateProfile = () => {
//     this.setState(
//       {
//         readOnly: !this.state.readOnly,
//       },
//       this.sendData
//     );
//   };

//   sendData = async () => {
//     if (this.state.readOnly) {
//       const updatedUser = {
//         name: this.state.name,
//         email: this.state.email,
//         address: this.state.address,
//         role: this.state.role,
//         salary: this.state.salary,
//         phoneNo: this.state.phoneNo,
//         team: this.state.team,
//         objective: this.state.objective,
//         skills: this.state.skills,
//         doj: this.state.doj,
//       };

//       const res = await Axios.post("/api/users/updateProfile", {
//         user: updatedUser,
//         id: this.state.id,
//       });
//       console.log(res.data);
//     }
//   };

//   onRadioChange = (e) => this.setState({ fresher: !this.state.fresher });

//   onChange = (e) => this.setState({ [e.target.name]: e.target.value });

//   render() {
//     return (
//       <Consumer>
//         {(value) => {
//           let { user } = value;
//           return (
//             <div className="row m-0">
//               {!user ? (
//                 <div className="w-100 h-100">
//                   <div className="spinner-border text-primary" role="status">
//                     <span className="sr-only">Loading...</span>
//                   </div>
//                 </div>
//               ) : (
//                 <>
//                   <div className="col-3 leftPart">
//                     <div className="container">
//                       <img
//                         src={icon}
//                         className="card-img-top avatar center"
//                         alt="..."
//                       />
//                       <h5 className="card-title text-center">{user.name}</h5>
//                       <hr style={{ backgroundColor: "white" }} />
//                       {this.state.readOnly ? (
//                         <p className="card-text">{this.state.objective}</p>
//                       ) : (
//                         <div>
//                           <textarea
//                             placeholder="Objective"
//                             rows="2"
//                             name="objective"
//                             className="form-control"
//                             id="objective"
//                             onChange={this.onChange}
//                             value={this.state.objective}
//                           />
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                   <div className="col rightPart">
//                     <div className="row">
//                       <div className="container mt-3 form">
//                         <form className="py-2">
//                           <h4>My Profile</h4>
//                           <div className="row mt-3">
//                             <div className="col">
//                               <div className="form-group">
//                                 <label htmlFor="name">Name</label>
//                                 <input
//                                   disabled={this.state.readOnly}
//                                   name="name"
//                                   type="text"
//                                   className="form-control"
//                                   id="name"
//                                   value={this.state.name}
//                                   onChange={this.onChange}
//                                 />
//                               </div>
//                             </div>
//                           </div>

//                           <div className="form-group">
//                             <label htmlFor="email">Email address</label>
//                             <input
//                               disabled={this.state.readOnly}
//                               type="email"
//                               name="email"
//                               className="form-control"
//                               id="email"
//                               aria-describedby="emailHelp"
//                               value={this.state.email}
//                               onChange={this.onChange}
//                             />
//                           </div>

//                           <div className="form-group">
//                             <label htmlFor="phoneNo">phoneNo</label>
//                             <input
//                               disabled={this.state.readOnly}
//                               type="phoneNo"
//                               name="phoneNo"
//                               className="form-control"
//                               id="phoneNo"
//                               aria-describedby="phoneNo"
//                               value={this.state.phoneNo}
//                               onChange={this.onChange}
//                             />
//                           </div>

//                           <div className="form-group">
//                             <label htmlFor="doj">Date of Joining</label>
//                             <input
//                               disabled={true}
//                               type="date"
//                               name="doj"
//                               className="form-control"
//                               id="doj"
//                               value={this.state.doj}
//                               onChange={this.onChange}
//                             />
//                           </div>

//                           <div className="form-group">
//                             <label htmlFor="skills">Skills</label>
//                             <input
//                               disabled={this.state.readOnly}
//                               type="text"
//                               name="skills"
//                               className="form-control"
//                               id="skills"
//                               value={this.state.skills}
//                               onChange={this.onChange}
//                             />
//                           </div>

//                           <div className="form-group">
//                             <label htmlFor="team">team</label>
//                             <input
//                               disabled={true}
//                               type="team"
//                               name="team"
//                               className="form-control"
//                               id="team"
//                               aria-describedby="team"
//                               value={this.state.team}
//                               onChange={this.onChange}
//                             />
//                           </div>

//                           <div className="form-group">
//                             <label htmlFor="salary">salary</label>
//                             <input
//                               disabled={true}
//                               type="number"
//                               name="salary"
//                               className="form-control"
//                               id="salary"
//                               value={this.state.salary}
//                               onChange={this.onChange}
//                             />
//                           </div>

//                           <div className="row">
//                             <div className="col">
//                               <div className="form-group">
//                                 <label htmlFor="address">address</label>
//                                 <input
//                                   disabled={this.state.readOnly}
//                                   type="text"
//                                   name="address"
//                                   className="form-control"
//                                   id="address"
//                                   value={this.state.address}
//                                   onChange={this.onChange}
//                                 />
//                               </div>
//                             </div>

//                             <div className="col">
//                               <div className="form-group">
//                                 <label htmlFor="role">Role</label>
//                                 <input
//                                   disabled={true}
//                                   type="text"
//                                   name="role"
//                                   className="form-control"
//                                   id="role"
//                                   value={this.state.role}
//                                   onChange={this.onChange}
//                                 />
//                               </div>
//                             </div>
//                           </div>

//                           <input
//                             type="button"
//                             className="btn btn-primary "
//                             onClick={this.updateProfile}
//                             value={this.state.readOnly ? "Edit" : "Save"}
//                           />
//                         </form>
//                       </div>
//                     </div>
//                   </div>
//                 </>
//               )}
//             </div>
//           );
//         }}
//       </Consumer>
//     );
//   }
// }
