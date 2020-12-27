import React, { Component } from "react";
import axios from "axios";

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
          console.log(res.data);
        });

        this.setState({
          name: "",
          email: "",
          message: "",
          error: "success",
        });
      } catch (err) {
        console.log(err);
      }
    }
  };

  render() {
    return (
      <div className="container mt-5">
        <h1 className="text-center">Contact Us</h1>
        <form onSubmit={this.submit.bind(this)}>
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

          <input type="submit" className="btn btn-primary" value="Sumbit" />
        </form>
      </div>
    );
  }
}

export default ContactUs;
