import React, { Component } from "react";
import "./profileModifier.css";

export default class Profile extends Component {
  render() {
    return (
      <div id="Yolo">
        <h1 id="title"> SCE Member Profile Page </h1>
        <div className="Top">
          <div
            id="background"
            background="./Image/water.jpeg"
            class="background"
          >
            <img
              src="./Image/AnnabelBoat.jpg"
              height="320"
              width="320"
              alt="Avatar"
              className="profilepic"
            />
            <div className="Top">
              <font color="black" id="name">
                <b>Name: Annabel Kusumo</b>
              </font>
              <div id="InfoBox">
                <h2 className="Top">Member Info: </h2>
                <section className="One">Username: YOLO1234</section>
                <section className="One">Email: example@gmail.com</section>
                <section className="One">
                  Password: <input type="password " name="password "></input>
                  <button>Change Password?</button>
                </section>
                <section className="One">Year joined: 2019</section>
                <section className="One">Membership type: 2019-2020</section>
                <section className="One">Door Code: h3ll0fr13nd</section>
                <section className="One"> </section>
              </div>
            </div>
          </div>
        </div>
        <div className="Body"></div>
        <div class="row">
          <div class="column">
            <img src="./Image/socialmedia.jpeg" height="350" width="360"></img>
          </div>
          <div class="column">
            <img src="./Image/hardware.jpeg" height="350" width="360"></img>
          </div>
          <div class="column">
            <img src="./Image/yougotthis.jpeg" height="350" width="360"></img>
          </div>
          <div class="column">
            <img src="./Image/compstuff.jpeg" height="350" width="360"></img>
          </div>
        </div>
      </div>
    );
    //return <h2>Hello there</h2>;
  }
}
