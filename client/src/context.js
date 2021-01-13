import React, { Component } from "react";
import axios from "axios";

const Context = React.createContext();

const reducer = (state, action) => {
  switch (action.type) {
    case "LOGGED_IN":
      return {
        ...state,
        token: action.payload.token,
        user: action.payload.user,
      };

    case "LOGGED_OUT":
      return {
        ...state,
        token: undefined,
        user: undefined,
      };

    case "APPROVED_REJECTED_LEAVE":
      return {
        ...state,
        user: {
          ...state.user,
          leaveRequests: state.user.leaveRequests.filter(
            (req) => req.reqId !== action.payload.reqId
          ),
        },
      };

    case "APPROVED_REJECTED_BONUS":
      return {
        ...state,
        user: {
          ...state.user,
          bonusRequests: state.user.bonusRequests.filter(
            (req) => req.reqId !== action.payload.reqId
          ),
        },
      };

    case "APPROVED_REJECTED_LOAN":
      return {
        ...state,
        user: {
          ...state.user,
          loanRequests: state.user.loanRequests.filter(
            (req) => req.reqId !== action.payload.reqId
          ),
        },
      };

    default:
      return state;
  }
};

export class Provider extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: undefined,
      token: undefined,
      dispatch: (action) => this.setState((state) => reducer(state, action)),
    };
  }

  async componentDidMount() {
    // check if logged in
    let token = localStorage.getItem("auth-token");
    if (token === null) {
      localStorage.setItem("auth-token", "");
      token = "";
    }

    try {
      // first check in admin model
      const tokenRes = await axios.post("/api/admin/tokenIsValid", null, {
        headers: { "x-auth-token": token },
      });
      if (tokenRes.data) {
        //logged in
        const adminRes = await axios.get("/api/admin", {
          headers: { "x-auth-token": token },
        });
        this.setState({
          token,
          user: adminRes.data.user,
        });
      } else {
        // now check in users model
        const tokenRes = await axios.post("/api/users/tokenIsValid", null, {
          headers: { "x-auth-token": token },
        });
        if (tokenRes.data) {
          // console.log("emp logged in");

          //logged in
          const userRes = await axios.get("/api/users", {
            headers: { "x-auth-token": token },
          });
          this.setState({
            token,
            user: userRes.data.user,
          });
        }
      }
    } catch (err) {
      console.log("ERROR: ", err);
    }
  }

  render() {
    return (
      <Context.Provider value={this.state}>
        {this.props.children}
      </Context.Provider>
    );
  }
}

export const Consumer = Context.Consumer;
