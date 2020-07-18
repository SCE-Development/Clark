import React, { Component } from 'react';
import './email-template.css';
import { getAllEvents } from '../../APIFunctions/Event';
import { Button } from 'reactstrap';
import BlastMailForm from './BlastMailForm.js';
import ConfirmationModal from './ConfirmationModal.js';
import { sendBlastEmail } from '../../APIFunctions/Mailer';
import { getAllUsers, filterUsers } from '../../APIFunctions/User';

export default class EmailTemplate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      events: [],
      recipients: '',
      subject: '',
      loadedContent: '',
      content: '',
      users: '',
      memberEmail: [],
      officerEmail: [],
      allEmail: [],
    };
  }

  // When page loads, perform getUsers() for email lists && getEvents() for
  // events in template
  componentDidMount() {
    if (this.props.user) {
      this.getUsers();
    }
    this.getEvents();
  }

  // get user emails from DB
  getUsers = async () => {
    let apiResponse = await getAllUsers(this.props.user.token);
    if (!apiResponse.error) {
      this.setState({ users: apiResponse.responseData });
    }
    // after getting api response, store them in state vars with function
    this.getFilteredUsers();
  };

  // Store emails to different state variables depending on their role
  getFilteredUsers = () => {
    let allUsers = filterUsers(this.state.users, 0);
    let officerEmail = [],
      memberEmail = [],
      allEmail = [];
    // forEach loop to push emails to their respective arrays
    allUsers.forEach(function(item) {
      // Access level >=2 is officers+, Access level >=0 but <2 are members
      if (item.accessLevel >= 2) {
        allEmail.push(item.email);
        officerEmail.push(item.email);
      } else if (item.accessLevel >= 0) {
        allEmail.push(item.email);
        memberEmail.push(item.email);
      }
    }, this.setState({ officerEmail, memberEmail, allEmail }));
  };

  // grab data from database and perform 'storeContent(events)' if apiResponse
  // is not empty
  getEvents = async () => {
    const apiResponse = await getAllEvents();
    if (!apiResponse.error) {
      this.storeContent(apiResponse);
    } else {
      let errorMessage = 'Unable to retrieve events.';
      this.setState({ events: [errorMessage] });
    }
  };

  // customize data with html, append header/footer, and store that to 'content'
  storeContent = async (events) => {
    const mailHeader =
      '<p><span style="font-size: 10pt; font-family: Arial;">' +
      '<strong>Hello SCE G4NG,</strong></span></p>' +
      '\n<p><span style="font-size: 10pt; font-family: Arial;">' +
      '<strong>This is our newsletter, please read ty.</strong></span></p>\n';

    const mailFooter =
      '<p><strong><span style="color: #236fa1; font-size: 10pt;">Software ' +
      'and Computer Engineering</span><span style="color: #236fa1; ' +
      'font-size: 10pt;"> Society<br /></span></strong>' +
      '<span style="font-size: 10pt;">Website: ' +
      '<a href="http://sce.engr.sjsu.edu">http://sce.engr.sjsu.edu</a><br />' +
      'Contact: <a href="mailto:sce.sjsu@gmail.com">sce.sjsu@gmail.com</a>' +
      '<br />Facebook: <a href="https://www.facebook.com/sjsusce/">@scesjsu' +
      '</a><br />Instagram: <a href="https://www.instagram.com/sjsusce/">' +
      '@scesjsu</a><br />CmpE Slack: <a href="https://cmpesjsu.slack.com/?' +
      'redir=%2Fmessages%2FCH6TTGXLG#/">#sce</a></span></p>';
    let data = undefined;

    try {
      let x = 0;
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
          '</span><br /><br />' +
          '<span style="font-size: 10pt;"><strong>When:</strong>&nbsp;' +
          eventDateFormatted +
          '&nbsp;at&nbsp;' +
          responseData.startTime.replace(/ /g, '') +
          '-' +
          responseData.endTime.replace(/ /g, '') +
          '</span><br /><span style="font-size: 10pt;"><strong>Where: ' +
          '</strong>&nbsp;' +
          responseData.eventLocation +
          '</span></p>\n<p><img style="max-height: 192px;' +
          ' max-width: 192px;" src="' +
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
        '<p>𝔁𝓾𝓮🥶𝓱𝓾𝓪🧚𝓹𝓲𝓪𝓸😻𝓹𝓲𝓪𝓸🗿𝓫𝓮𝓲👺𝓯𝓮𝓷𝓰🤩' +
        '𝔁𝓲𝓪𝓸😼𝔁𝓲𝓪𝓸👣</p>\n<p>&nbsp;</p>\n' +
        mailFooter;
    } catch (error) {
      return error;
    }
    this.updateContent(data);
  };

  // Used by handleLoadContent() to format the dates from getAllEvents()
  // to MM/DD/YYYY format
  returnProperFormattedDate = (date) => {
    if (date !== null) {
      let year = date.substring(0, 4);
      return date.substring(5, date.length) + '-' + year;
    } else {
      return null;
    }
  };

  // Update 'subject' state
  updateSubject = (e) => {
    this.setState({ subject: e });
  };

  // Update 'recipients' state
  updateRecipients = (e) => {
    this.setState({ recipients: e });
  };

  // Update 'content' state. 'content' is where the template created is stored.
  updateContent = (e) => {
    this.setState({ content: e });
  };

  // Clear Button 'Disabled' prop boolean
  checkEmpty = () => {
    return (
      this.state.loadedContent === '' &&
      this.state.subject === '' &&
      this.state.recipients === ''
    );
  };

  // Send Button 'Disabled' prop boolean
  checkEmptyInputs = () => {
    return (
      this.state.recipients !== '' &&
      this.state.subject !== '' &&
      this.state.loadedContent !== ''
    );
  };

  // Load Template Button 'Disabled' prop boolean
  checkLoadedContent = () => {
    return this.state.loadedContent === this.state.content;
  };

  // Used by TinyMCE text area to update it. 'loadedContent' is
  // what's in the text area.
  handleEditorChange = (e) => {
    this.setState({ loadedContent: e });
  };

  // 'Load Template' Button onClick
  handleLoadContent = async () => {
    this.setState({ loadedContent: this.state.content });
  };

  // 'Clear' Button onClick
  handleClear = () => {
    this.setState({ loadedContent: '', subject: '', recipients: '' });
  };

  // 'Send' Button onClick
  handleSend = async () => {
    // Since recipients is a list of emails, need to load a certain list
    // of emails depending on the recipients dropdown value
    let recipients = undefined;
    if (this.state.recipients === 'Members') {
      recipients = this.state.memberEmail;
    } else if (this.state.recipients === 'Officers') {
      recipients = this.state.officerEmail;
    } else if (this.state.recipients === 'Everyone') {
      recipients = this.state.allEmail;
    }
    let status = await sendBlastEmail(
      recipients,
      this.state.subject,
      this.state.loadedContent
    );

    // Clear form
    this.setState({
      recipients: '',
      subject: '',
      loadedContent: '',
    });

    // Alerts to notify user whether or not the email was successfully sent
    // setTimeout is used to make sure form is cleared before alert pops up
    window.setTimeout(function() {
      if (status.error) {
        alert('Uh oh, looks like there were issues sending the email.');
      } else {
        alert('Everything went well! Your email has been sent!');
      }
    }, 100);
  };

  // Copies all emails onto clipboard
  handleCopyEmails = () => {
    let range = document.createRange();
    range.selectNode(document.getElementById('email-message'));
    window.getSelection().removeAllRanges(); // clear current selection
    window.getSelection().addRange(range); // to select text
    document.execCommand('copy');
    window.getSelection().removeAllRanges(); // to deselect
    document.getElementById('copy-notification2').style.display = 'block';
  };

  render() {
    return (
      <div className="email-template">
        <div>
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
          <ConfirmationModal
            handleSend={this.handleSend}
            checkEmptyInputs={this.checkEmptyInputs}
          />
        </div>
        <div id="email-message">
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
