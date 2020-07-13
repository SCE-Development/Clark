import React, { Component, useState } from "react";
import "./email-template.css";
import { getAllEvents } from "../../APIFunctions/Event";
import { Button } from "reactstrap";
import BlastMailForm from "./BlastMailForm.jsx";
import ConfirmationModal from "./ConfirmationModal";
import {
  sendVerificationEmail,
  sendBlastEmail,
} from "../../APIFunctions/Mailer";

export default class EmailTemplate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      events: [],
      recipients: "",
      subject: "",
      loadedContent: "",
      submittedRecipients: "",
      submittedSubject: "",
      submittedContent: "",
      content: "",
      loadContentButtonPressCount: 0,
    };
  }

  //perform getEvents() when the page loads
  componentDidMount() {
    this.getEvents();
  }

  //grab data from database and perform 'storeContent(events)' if apiResponse is not empty
  getEvents = async () => {
    const apiResponse = await getAllEvents();
    if (!apiResponse.error) {
      // this.setState({
      //   events: apiResponse.responseData,
      // });
      this.storeContent(apiResponse);
    } else {
      let errorMessage = "Unable to retrieve events.";
      this.setState({ events: [errorMessage] });
    }
  };

  //customize data with html, append header/footer, and store that to 'content'
  storeContent = async (events) => {
    const mailHeader =
      '<p><span style="font-size: 10pt; font-family: Arial;"><strong>Hello SCE G4NG,</strong></span></p>' +
      '\n<p><span style="font-size: 10pt; font-family: Arial;"><strong>This is our newsletter, please read ty.</strong></span></p>\n';

    const mailFooter =
      '<p><strong><span style="color: #236fa1; font-size: 10pt;">Software and Computer Engineering</span>' +
      '<span style="color: #236fa1; font-size: 10pt;"> Society<br /></span></strong>' +
      '<span style="font-size: 10pt;">Website: <a href="http://sce.engr.sjsu.edu">http://sce.engr.sjsu.edu</a>' +
      '<br />Contact: <a href="mailto:sce.sjsu@gmail.com">sce.sjsu@gmail.com</a><br />Facebook: ' +
      '<a href="https://www.facebook.com/sjsusce/">@scesjsu</a><br />Instagram: ' +
      '<a href="https://www.instagram.com/sjsusce/">@scesjsu</a><br />CmpE Slack: ' +
      '<a href="https://cmpesjsu.slack.com/?redir=%2Fmessages%2FCH6TTGXLG#/">#sce</a></span></p>';

    try {
      var x = 0;
      var data = undefined;
      for (x = 0; x < events.responseData.length; x++) {
        let responseData = events.responseData[x];
        let eventDateFormatted = this.returnProperFormattedDate(
          responseData.eventDate.toString().substring(0, 10)
        );

        const dataSingle =
          '<p><br /><span style="font-size: 14pt; color: #0055a2;"><strong>' +
          responseData.title +
          '</strong></span><br /><span style="font-size: 10pt;">' +
          responseData.description +
          "</span><br /><br />" +
          '<span style="font-size: 10pt;"><strong>When:</strong>&nbsp;' +
          eventDateFormatted +
          "&nbsp;at&nbsp;" +
          responseData.startTime.replace(/ /g, "") +
          "-" +
          responseData.endTime.replace(/ /g, "") +
          '</span><br /><span style="font-size: 10pt;"><strong>Where:</strong>&nbsp;' +
          responseData.eventLocation +
          '</span></p>\n<p><img style="max-height: 192px; max-width: 192px;" src="' +
          responseData.imageURL +
          '" /></p>\n';

        if (x === 0) {
          data = dataSingle;
        } else {
          data = data + dataSingle;
        }
      }
      data =
        mailHeader +
        data +
        "<p>𝔁𝓾𝓮🥶𝓱𝓾𝓪🧚𝓹𝓲𝓪𝓸😻𝓹𝓲𝓪𝓸🗿𝓫𝓮𝓲👺𝓯𝓮𝓷𝓰🤩𝔁𝓲𝓪𝓸😼𝔁𝓲𝓪𝓸👣</p>\n<p>&nbsp;</p>\n" +
        mailFooter;
    } catch (error) {
      console.log("Something's up", error);
    }
    this.updateContent(data);
  };

  //Used by handleLoadContent() to format the dates from getAllEvents() to MM/DD/YYYY format
  returnProperFormattedDate = (date) => {
    if (date !== null) {
      var year = date.substring(0, 4);
      return date.substring(5, date.length) + "-" + year;
    } else {
      return null;
    }
  };

  //Update 'subject' state
  updateSubject = (e) => {
    this.setState({ subject: e });
  };

  //Update 'recipients' state
  updateRecipients = (e) => {
    this.setState({ recipients: e });
  };

  //Update 'content' state. 'content' is where the template created is stored.
  updateContent = (e) => {
    this.setState({ content: e });
  };

  //Clear Button 'Disabled' prop boolean
  checkEmpty = () => {
    return (
      this.state.loadedContent === "" &&
      this.state.subject === "" &&
      this.state.recipients === ""
    );
  };

  //Send Button 'Disabled' prop boolean
  checkEmptyInputs = () => {
    return (
      this.state.recipients !== "" &&
      this.state.subject !== "" &&
      this.state.loadedContent !== ""
    );
  };

  //Load Template Button 'Disabled' prop boolean
  checkLoadedContent = () => {
    return this.state.loadedContent === this.state.content;
  };

  //Used by TinyMCE text area to update it. 'loadedContent' is what's in the text area.
  handleEditorChange = (e) => {
    this.setState({ loadedContent: e });
  };

  //'Load Template' Button onClick
  handleLoadContent = async () => {
    this.setState({ loadedContent: this.state.content });
  };

  //'Clear' Button onClick
  handleClear = () => {
    this.setState({ loadedContent: "", subject: "", recipients: "" });
  };

  //'Send' Button onClick
  handleSend = () => {
    sendBlastEmail(
      "justin.zhu@sjsu.edu",
      this.state.subject,
      this.state.loadedContent
    );

    this.setState(
      {
        submittedRecipients: this.state.recipients,
        submittedSubject: this.state.subject,
        submittedContent: this.state.loadedContent,
        recipients: "",
        subject: "",
        loadedContent: "",
      },
      this.checkConsole
    );
  };

  //Used in testing handleSend()
  checkConsole = () => {
    console.log("------------ Submit ------------");
    console.log("Submitted Recipients: ", this.state.submittedRecipients);
    // console.log("Recipients: ", this.state.recipients);
    console.log("Submitted Subject:", this.state.submittedSubject);
    // console.log("Subject:", this.state.subject);
    console.log("Submitted Content: ", this.state.submittedContent);
    // console.log("Content: ", this.state.loadedContent);
  };

  // Copies all emails onto clipboard
  handleCopyEmails = () => {
    let range = document.createRange();
    range.selectNode(document.getElementById("email-message"));
    window.getSelection().removeAllRanges(); // clear current selection
    window.getSelection().addRange(range); // to select text
    document.execCommand("copy");
    window.getSelection().removeAllRanges(); // to deselect
    document.getElementById("copy-notification2").style.display = "block";
  };

  // //Used with 'Send Verification Test' button to test the sending function, no longer needed
  testAPI = () => {
    // console.log("email:");
    sendVerificationEmail("justin.zhu@sjsu.edu", "Justin");
  };

  render() {
    // let emailMessages = this.state.events.map((event, i) => {
    //   let currentDate = new Date().toJSON();
    //   if (event.eventDate >= currentDate) {
    //     return (
    //       <div key={i}>
    //         Title: {event.title}
    //         <br />
    //         Date: {event.eventDate.substring(0, 10)}
    //         <br />
    //         Time: {event.startTime} - {event.endTime}
    //         <br />
    //         Description: {event.description}
    //         <br />
    //         <br />
    //       </div>
    //     );
    //   }
    //   return "";
    // });

    return (
      <div className="email-template">
        <div>
          {/* <Button
            outline
            id="email-copy-button"
            onClick={this.handleCopyEmails}
          >
            Copy to Clipboard
          </Button>
          <p id="copy-notification2">Copied message to clipboard! :)</p> */}
          <Button
            id="email-template-button"
            onClick={this.handleClear}
            disabled={this.checkEmpty()}
          >
            Clear
          </Button>
          <Button
            id="email-template-button"
            onClick={this.handleLoadContent}
            disabled={this.checkLoadedContent()}
          >
            Load Template
          </Button>
          {/* <Button
            id="email-template-button"
            onClick={async () => {
              this.handleSend();
            }}
            disabled={!this.checkEmptyInputs()}
          >
            Send
          </Button> */}
          <ConfirmationModal
            handleSend={this.handleSend}
            checkEmptyInputs={this.checkEmptyInputs}
          />
          <Button onClick={this.testAPI}>Send Verification Test</Button>
        </div>
        <div id="email-message">
          {/* {emailMessages} */}
          <BlastMailForm
            handleEditorChange={this.handleEditorChange}
            recipients={this.state.recipients}
            updateRecipients={this.updateRecipients}
            subject={this.state.subject}
            updateSubject={this.updateSubject}
            content={this.state.content}
            updateContent={this.updateContent}
            loadedContent={this.state.loadedContent}
          />
        </div>
      </div>
    );
  }
}
