import React, { Component } from "react";
import "../../../assets/newsCard.css";

export default class extends Component {
  onGetTitle = (title) => {
    return title.split("-")[0];
  };
  render() {
    const { article_url, title, image_url, source_name } = this.props.data;
    return (
      <div className="newsContainer">
        <h6 className="titleText">{this.onGetTitle(title)}</h6>

        <hr />

        <img src={image_url} alt="Image Not Available" className="newsImg" />

        {/* <h6 className="my-3">{source_name}</h6> */}

        <a
          href={article_url}
          target="_blank"
          style={{
            color: "#FF4500",
            textDecoration: "none",
          }}
        >
          <h6 className="mt-5 text-right">Link to full article</h6>
        </a>
      </div>
    );
  }
}
