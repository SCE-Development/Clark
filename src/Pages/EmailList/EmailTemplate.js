import React, { Component } from "react";
import "./email-template.css";
import { getAllEvents } from "../../APIFunctions/Event";
import { Button } from "reactstrap";
import BlastMailForm from "./BlastMailForm.jsx";

export default class EmailTemplate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      events: [],
      recipients: "",
      subject: "",
      submittedRecipients: "",
      submittedSubject: "",
      submittedContent: "",
      content: "",
      loadedContentBoolean: false,
    };
  }

  componentDidMount() {
    this.getEvents();
  }

  getEvents = async () => {
    const apiResponse = await getAllEvents();
    if (!apiResponse.error) {
      this.setState({
        events: apiResponse.responseData,
      });
    } else {
      let errorMessage = "Unable to retrieve events.";
      this.setState({ events: [errorMessage] });
    }
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

  handleBlastMailData = () => {
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

  //Used in testing handleBlastMailData()
  checkConsole = () => {
    console.log("------------ Submit ------------");
    console.log("Submitted Recipients: ", this.state.submittedRecipients);
    // console.log("Recipients: ", this.state.recipients);
    console.log("Submitted Subject:", this.state.submittedSubject);
    // console.log("Subject:", this.state.subject);
    console.log("Submitted Content: ", this.state.submittedContent);
    // console.log("Content: ", this.state.loadedContent);
  };

  updateSubject = (e) => {
    this.setState({ subject: e });
  };

  updateRecipients = (e) => {
    this.setState({ recipients: e });
  };

  //'content' is where the template created is originally stored
  updateContent = (e) => {
    this.setState({ content: e });
  };

  //'loadedContent' is what's in the text area
  handleEditorChange = (e) => {
    this.setState({ loadedContent: e });
    // console.log("Handle Editor Change", this.state.loadedContent);
  };

  //Clear Button 'onClick'
  handleClear = () => {
    this.setState({ loadedContent: "", subject: "", recipients: "" });
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
    return (
      this.state.loadedContentBoolean &&
      this.state.loadedContent.valueOf() === this.state.content.valueOf()
    );
  };

  handleLoadContent = async () => {
    let events = await getAllEvents();

    const mailHeader =
      '<p><span style="font-size: 10pt; font-family: Arial;"><strong>Hello SCE G4NG,</strong></span></p>' +
      '\n<p><span style="font-size: 10pt; font-family: Arial;"><strong>This is our newsletter, please read ty.</strong></span></p>\n';

    const mailFooter =
      '<p><strong><span style="color: #236fa1; font-size: 10pt;">Software and Computer Engineering</span>' +
      '<span style="color: #236fa1; font-size: 10pt;"> Society<br /></span></strong>' +
      '<span style="font-size: 10pt;">Website: <a href="http://sce.engr.sjsu.edu">http://sce.engr.sjsu.edu</a>' +
      '<br />Contact: <a href="mailto:sce.sjsu@gmail.com">sce.sjsu@gmail.com</a><br />Facebook:' +
      '<a href="https://www.facebook.com/sjsusce/">@scesjsu</a><br />Instagram:' +
      '<a href="https://www.instagram.com/sjsusce/">@scesjsu</a><br />CmpE Slack:' +
      '<a href="https://cmpesjsu.slack.com/?redir=%2Fmessages%2FCH6TTGXLG#/">#sce</a></span></p>';
    // console.log("Test: ", events);
    try {
      var x = 0;
      var data = undefined;
      for (x = 0; x < events.responseData.length; x++) {
        let responseData = events.responseData[x];
        let eventDateFormatted = this.returnProperFormattedDate(
          responseData.eventDate.toString().substring(0, 10)
        );
        // console.log("---------------------- START HERE ----------------------");
        // console.log("YEP Clicked Modal Toggle Button", events);
        // console.log("Response Data:", events.responseData);
        // console.log("title: ", responseData.title);
        // console.log("description: ", responseData.description);
        // console.log("space here");
        // console.log("startTime: ", responseData.startTime);
        // console.log("endTime: ", responseData.endTime);
        // console.log("eventLocation: ", responseData.eventLocation);
        // console.log("edited event date: ", eventDateEdit);
        // console.log("---------------------- END HERE ------------------------");
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
      this.updateContent(data);
      this.setState({ loadedContent: this.state.content });
      this.setState({ loadedContentBoolean: true });
    } catch (error) {
      console.log("Something's up", error);
    }
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
          <Button
            id="email-template-button"
            onClick={async () => {
              this.handleBlastMailData();
            }}
            disabled={!this.checkEmptyInputs()}
          >
            Send
          </Button>
        </div>
        <div id="email-message">
          {/* {emailMessages} */}
          <BlastMailForm
            // handleData={this.handleBlastMailData}
            handleEditorChange={this.handleEditorChange}
            // handleLoadContent={this.handleLoadContent}
            // handleClear={this.handleClear}
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
