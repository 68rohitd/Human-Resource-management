import React from "react";
import { Spring } from "react-spring/renderprops";
import checkList from "../../assets/images/checklist.svg";
import "../../assets/about-styles/about.css";

export default function About() {
  return (
    <div className="container mt-5">
      <div className="row m-0">
        <Spring
          from={{ opacity: 0 }}
          to={{ opacity: 1 }}
          config={{ duration: 800 }}
        >
          {(props) => (
            <div style={props}>
              <div className="col-12 col-sm-12 ">
                <h1 style={{ fontWeight: "lighter mt-5" }}>
                  <span className="font-italic">About</span>{" "}
                  <span>clear.mind</span>
                </h1>
                <p className="lead font-italic">
                  Simple App to Manage Your Life
                </p>

                <h1 className="font-italic">Features</h1>
                <p className="mb-1 font-italic">In-built categories</p>
                <p className="mb-1 font-italic">One click Filter todos</p>
                <p className="mb-1 font-italic">Speak out loud feature</p>
                <p className="mb-1 font-italic">
                  Add reminders directly to your google calender!
                </p>
                <p className="mb-1 font-italic">
                  Access History, Attach files!
                </p>
                <p className="mb-1 font-italic">
                  Responsive Design. Sign in once, use on any device
                </p>
                <p className="mb-1 font-italic">
                  Search todos by date, category, status, importance
                </p>

                <p className="mb-1 font-italic">
                  <b>Introducing Teams! Create teams, add team members etc</b>
                </p>

                <p className="mb-1 font-italic">
                  Login/Register feature, so you can access your todos anytime,
                  anywhere!
                </p>

                <p className="text-secondary font-italic mt-5">Version 1.0.0</p>
              </div>

              <div className="col">
                <img className="aboutSVG" src={checkList} alt="" />
              </div>
            </div>
          )}
        </Spring>
      </div>
    </div>
  );
}
