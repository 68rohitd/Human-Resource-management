import React, { Component } from "react";
import "../../../../assets/stats-styles/card.css";

export default class Card extends Component {
  render() {
    let label = this.props.label;
    let data = this.props.data;
    data = data.toString();
    data = data.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    return (
      <div className="container infoCard">
        <span className="myLabel">{label}</span> <br />
        <span className="myData">{data}</span>
      </div>
    );
  }
}
