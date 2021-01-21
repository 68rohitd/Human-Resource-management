import React, { Component } from "react";
import "../../../assets/newsCard.css";

export default class NewsCard extends Component {
  onGetTitle = (title) => {
    return title.split("-")[0];
  };
  render() {
    const { article_url, title, image_url } = this.props.data;
    return (
      <div className="newsContainer">
        <h6 className="titleText">{this.onGetTitle(title)}</h6>

        <hr />

        <img src={image_url} alt="" className="newsImg" />

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
