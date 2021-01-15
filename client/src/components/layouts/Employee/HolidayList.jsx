import React, { Component } from "react";

export default class HolidayList extends Component {
  render() {
    return (
      <div
        className="jumbotron text-center pt-3"
        style={{ height: "460px", overflowY: "scroll" }}
      >
        <h1>List Of Holidays</h1>

        <div className="row">
          <div className="col">
            <h5>Date</h5>
          </div>
          <div className="col">
            <h5>Day</h5>
          </div>
          <div className="col">
            <h5>Occasion</h5>
          </div>
        </div>
        <hr />

        <div className="row">
          <div className="col">1 Jan 2021</div>
          <div className="col">Friday</div>
          <div className="col">New Year</div>
        </div>
        <hr />

        <div className="row">
          <div className="col">14 Jan 2021</div>
          <div className="col">Thrusday</div>
          <div className="col">Makar Sankranti</div>
        </div>
        <hr />

        <div className="row">
          <div className="col">26 Jan 2021</div>
          <div className="col">Tuesday</div>
          <div className="col">Republic Day</div>
        </div>
        <hr />

        <div className="row">
          <div className="col">29 March 2021</div>
          <div className="col">Monday</div>
          <div className="col">Holi</div>
        </div>
        <hr />

        <div className="row">
          <div className="col">2 April 2021</div>
          <div className="col">Friday</div>
          <div className="col">Good Friday</div>
        </div>
        <hr />

        <div className="row">
          <div className="col">13 April 2021</div>
          <div className="col">Tuesday</div>
          <div className="col">Gudi Padwa</div>
        </div>
        <hr />

        <div className="row">
          <div className="col">13 May 2021</div>
          <div className="col">Thursday</div>
          <div className="col">Ramjan Id</div>
        </div>
        <hr />

        <div className="row">
          <div className="col">20 July 2021</div>
          <div className="col">Tuesday</div>
          <div className="col">Bakri Id</div>
        </div>
        <hr />

        <div className="row">
          <div className="col">30 August 2021</div>
          <div className="col">Monday</div>
          <div className="col">Janmashthami</div>
        </div>
        <hr />

        <div className="row">
          <div className="col">10 September 2021</div>
          <div className="col">Friday</div>
          <div className="col">Ganesh Chaturthi</div>
        </div>
        <hr />

        <div className="row">
          <div className="col">15 October 2021</div>
          <div className="col">Friday</div>
          <div className="col">Dussehra</div>
        </div>
        <hr />

        <div className="row">
          <div className="col">4 November 2021</div>
          <div className="col">Thursday</div>
          <div className="col">Diwali</div>
        </div>
        <hr />
      </div>
    );
  }
}
