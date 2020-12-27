import React from "react";
import PageNotFoundSVG from "../../assets/pageNotFound-styles/pageNotFound.svg";
import "../../assets/pageNotFound-styles/pageNotFound.css";

export default function PageNotFound() {
  return (
    <div>
      <h2 className="pageNotFoundText text-center mt-3">OOps! We're lost!</h2>
      <img className="PageNotFoundSVG" src={PageNotFoundSVG} alt="login.svg" />
    </div>
  );
}
