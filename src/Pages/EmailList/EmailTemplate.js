import React, { Component } from 'react';
import './email-template.css';
import { getAllEvents } from '../../APIFunctions/Event';
import {
  Button
} from 'reactstrap';

export default class EmailTemplate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      events: []
    };
  }

  componentDidMount() {
    this.getEvents();
  }

  getEvents = async () => {
    const apiResponse = await getAllEvents();
    if(!apiResponse.error){
      this.setState({
        events: apiResponse.responseData
      });
    } else {
      let errorMessage = 'Unable to retrieve events.';
      this.setState({ events: [errorMessage] });
    }
  }

  // Copies all emails onto clipboard
  handleCopyEmails = () => {
    let range = document.createRange();
    range.selectNode(document.getElementById('email-message'));
    window.getSelection().removeAllRanges(); // clear current selection
    window.getSelection().addRange(range); // to select text
    document.execCommand('copy');
    window.getSelection().removeAllRanges();// to deselect
    document.getElementById('copy-notification2').style.display = 'block';
  }

  render() {
    let emailMessages = this.state.events.map((event, i) => {
      let currentDate = new Date().toJSON();
      if(event.eventDate >= currentDate){
        return (
          <div key={i}>
            Title: {event.title}<br/>
            Date: {event.eventDate.substring(0, 10)}<br/>
            Time: {event.startTime} - {event.endTime}<br/>
            Description: {event.description}<br/><br/>
          </div>
        );
      }
      return '';
    });

    return (
      <div className='email-template'>
        <div>
          <Button outline id="email-copy-button"
            onClick={this.handleCopyEmails}>
                Copy to Clipboard
          </Button>
          <p id="copy-notification2">Copied message to clipboard! :)</p>
        </div>
        <div id="email-message">
          {emailMessages}
        </div>
      </div>
    );
  }
}
