import React, { Component } from "react";
import axios from "axios";
import toast from "toasted-notes";
import "toasted-notes/src/styles.css";
import contactUs from "../../assets/images/contactUs.png";
import { Spring } from "react-spring/renderprops";

class ContactUs extends Component {
  constructor() {
    super();
    this.state = {
      name: "",
      email: "",
      message: "",
      error: "",
    };
  }

  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
      error: "",
    });
  };

  submit = (e) => {
    e.preventDefault();
    let { name, email, message } = this.state;
    name = name.trim();
    email = email.trim();
    message = message.trim();
    if (name.length === 0 || email.length === 0 || message.length === 0) {
      this.setState({
        error: "failure",
      });
    } else {
      const contactMessage = {
        name,
        email,
        message,
      };
      try {
        axios.post("/api/email/contactUs", contactMessage).then((res) => {
          this.setState({
            name: "",
            email: "",
            message: "",
          });

          console.log("sent: ", res.data);

          toast.notify("Successfully submitted your message", {
            position: "top-right",
          });
        });
      } catch (err) {
        console.log(err);
      }
    }
  };

  render() {
    return (
      <Spring
        from={{ opacity: 0 }}
        to={{ opacity: 1 }}
        config={{ duration: 300 }}
      >
        {(props) => (
          <div className="container mt-5" style={props}>
            <div className="row">
              <div className="col">
                <img className="loginSVG" src={contactUs} alt="" />
              </div>

              <div className="col">
                <form className="addEmpForm" onSubmit={this.submit.bind(this)}>
                  <h1 className="text-center">Contact Us</h1>
                  <div className="form-group">
                    {this.state.error ? (
                      this.state.error === "success" ? (
                        <div className="alert alert-success">
                          Successfully submitted you message!
                        </div>
                      ) : (
                        <div className="alert alert-danger">
                          Please enter all the fields!
                        </div>
                      )
                    ) : null}
                    <label>Name</label>
                    <input
                      type="text"
                      value={this.state.name}
                      onChange={this.onChange}
                      className="form-control"
                      id="name"
                      name="name"
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      value={this.state.email}
                      className="form-control"
                      id="email"
                      onChange={this.onChange}
                      name="email"
                      placeholder="example@example.com"
                    />
                  </div>
                  <div className="form-group">
                    <label>Your message/suggestion</label>
                    <textarea
                      className="form-control"
                      value={this.state.message}
                      onChange={this.onChange}
                      id="message"
                      name="message"
                      rows="3"
                    ></textarea>
                  </div>

                  <input
                    type="submit"
                    className="btn btn-primary"
                    value="Sumbit"
                  />
                </form>
              </div>
            </div>
          </div>
        )}
      </Spring>
    );
  }
}

export default ContactUs;
