import React from "react";
import "./announcementPage.css";
import AnnouncementList from "./announcementList";

export default class AnnouncementsPage extends React.Component {
  constructor(props) {
    super(props);
    console.log("Constructor props:");
    console.dir(props);
    console.log("Local storage:");
    console.dir(window.localStorage);

  }

  //first load when page start
  componentDidMount() { }

  render() {
    return (
      <div>
        <AnnouncementList />
      </div>
    );
  }
}
