import React from "react";
import { Card, CardTitle, Col, CardText } from "reactstrap";
import "./announcementsPage.css";
import Layout from "../../../Components/Layout/Layout";
import {
  // NavbarBrand,
  // ListGroup,
  // ListGroupItem,
  // ListGroupItemHeading,
  // ListGroupItemText
  Jumbotron,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormGroup,
  Label,
  Input
} from "reactstrap";
// import axios from 'axios';
// import NavBarTop from "./navBarTop.jsx";

export default class AnnouncementsPage extends React.Component {
  constructor(props) {
    super(props);
    console.log("Constructor props:");
    console.dir(props);
    console.log("Local storage:");
    console.dir(window.localStorage);

    this.state = {
      publishedEvents: [
        {
          eventName: "SJSU Eng conference1",
          eventDescription: "blah",
          eventDate: "10/10/10",
          eventTime: "10pm",
          eventLocation: "SJSU",
          eventHost: "Hashim",
          eventContact: "you"
        },
        {
          eventName: "SJSU Eng conference2",
          eventDescription: "blah",
          eventDate: "10/10/10",
          eventTime: "10pm",
          eventLocation: "SJSU",
          eventHost: "Hashim",
          eventContact: "you"
        }
      ]
    };
  }

  //first load when page start
  componentDidMount() {}

  render() {
    return (
      <div id="parent">
        <div className="lordie">haha</div>
        <modal
          isOpen={false}
          contentLabel="Inline Styles Modal Example"
          style={{
            overlay: {
              backgroundColor: "papayawhip"
            },
            content: {
              color: "lightsteelblue"
            }
          }}
        >
          <p>Modal text!</p>
          <button onClick={this.handleCloseModal}>Close Modal</button>
        </modal>
      </div>
    );
  }
}
