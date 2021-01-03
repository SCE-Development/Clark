import React, { Component } from 'react';
import './email-template.css';
import { getAllEvents } from '../../APIFunctions/Event';
import { Button } from 'reactstrap';
import BlastMailForm from './BlastMailForm.js';
import SendButtonModal from './SendButtonModal.js';
import { sendBlastEmail } from '../../APIFunctions/Mailer';
import { getAllUsers, filterUsers } from '../../APIFunctions/User';
import { membershipState } from '../../Enums';

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
      alumniEmail: [],
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

  getUsers = async () => {
    let apiResponse = await getAllUsers(this.props.user.token);
    if (!apiResponse.error) {
      this.setState({ users: apiResponse.responseData });
    }
    // after getting api response, store them in state vars with function
    this.getFilteredUsers();
  };

  getFilteredUsers = () => {
    try {
      let allUsers = filterUsers(this.state.users, 0);
      let officerEmail = [],
        memberEmail = [],
        alumniEmail = [],
        allEmail = [];
      // forEach loop to push emails to their respective arrays
      allUsers.forEach(function(item) {
        // Access level >=3 is officers+, Access level >=2 but <3 are members
        // Access level == 0 is alumni
        if (item.accessLevel >= membershipState.MEMBER) {
          allEmail.push(item.email);
        }
        if (item.accessLevel >= membershipState.OFFICER) {
          officerEmail.push(item.email);
        } else if (item.accessLevel >= membershipState.MEMBER) {
          memberEmail.push(item.email);
        } else if (item.accessLevel == membershipState.ALUMNI) {
          alumniEmail.push(item.email);
        }
      }, this.setState({ officerEmail, memberEmail, alumniEmail, allEmail }));
    } catch (error) {
      const alertText =
        'Looks like there was a problem with fetching the users. ' +
        'If you are trying to send emails, please contact the devs ' +
        'and try again later.';
      window.setTimeout(() => {
        alert(alertText);
      }, 1750);
    }
  };

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
  // NOTE: html formatting with this text editor follows some strict rules
  // please make sure your formatting is correct or the load template 'disabled'
  // case will break. Use console logs on the 'load template' function.
  storeContent = async (events) => {
    const headerGreeting =
      'Hello SCE Members,';

    const headerText =
      'This is our newsletter! Please read it, thanks.';

    const mailHeader =
      '<p><span style="font-size: 10pt; font-family: Arial;">' +
      '<strong>' + headerGreeting + '</strong></span></p>' +
      '\n<p><span style="font-size: 10pt; font-family: Arial;">' +
      '<strong>' + headerText + '</strong></span></p>\n';

    const mailFooter =
      '<p><br /><strong><span style="color: #3c81a9; font-size: 10pt;">' +
      'Software and Computer Engineering Society<br /></span></strong>' +
      '<span style="font-size: 10pt;">Website: ' +
      '<a href="http://sce.engr.sjsu.edu">http://sce.engr.sjsu.edu</a><br />' +
      'Contact: <a href="mailto:sce.sjsu@gmail.com">sce.sjsu@gmail.com</a>' +
      '<br />Facebook: <a href="https://www.facebook.com/sjsusce/">@scesjsu' +
      '</a><br />Instagram: <a href="https://www.instagram.com/sjsusce/">' +
      '@scesjsu</a><br />CmpE Slack: <a href="https://cmpesjsu.slack.com/?' +
      'redir=%2Fmessages%2FCH6TTGXLG#/">#sce</a></span></p>';

    let data = undefined;
    try {
      events.responseData.forEach((currentEvent, index) => {
        let eventDateFormatted = this.returnProperFormattedDate(
          currentEvent.eventDate.substring(0, 10)
        );
        const dataSingle =
          '<p><br /><span style="font-size: 14pt; color: #3c81a9;"><strong>' +
          currentEvent.title +
          '</strong></span><br /><span style="font-size: 10pt;">' +
          currentEvent.description +
          '</span><br /><br />' +
          '<span style="font-size: 10pt;"><strong>When:</strong>&nbsp;' +
          eventDateFormatted +
          '&nbsp;at&nbsp;' +
          currentEvent.startTime.replace(/ /g, '') +
          '-' +
          currentEvent.endTime.replace(/ /g, '') +
          '</span><br /><span style="font-size: 10pt;"><strong>Where:' +
          '</strong>&nbsp;' +
          currentEvent.eventLocation +
          '</span></p>\n<p><img style="max-height: 192px;' +
          ' max-width: 192px;" src="' +
          currentEvent.imageURL +
          '" /></p>\n';
        if (index === 0) {
          data = dataSingle;
        } else {
          data = data + dataSingle;
        }
      });
      if (data === undefined) {
        data =
          mailHeader +
          mailFooter;
      } else {
        data =
          mailHeader +
          data +
          mailFooter;
      }
      this.updateContent(data);
    } catch (error) {
      window.setTimeout(() => {
        const alertText =
          'Looks like there was a problem with creating the event template. ' +
          'If you are trying to send emails, please contact the devs ' +
          'and try again later.';
        alert(alertText);
      }, 1750);
    }
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

  updateSubject = (e) => {
    this.setState({ subject: e });
  };

  updateRecipients = (e) => {
    this.setState({ recipients: e });
  };

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
  checkEmptyAllInputs = () => {
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
  // what is in the text area.
  handleEditorChange = (e) => {
    this.setState({ loadedContent: e });
  };

  handleLoadContent = async () => {
    this.setState({ loadedContent: this.state.content });
  };

  handleClear = () => {
    this.setState({ loadedContent: '', subject: '', recipients: '' });
  };

  handleSend = async () => {
    // Since recipients is a list of emails, need to load a certain list
    // of emails depending on the recipients dropdown value
    let emailList = undefined;
    if (this.state.recipients === 'Members') {
      emailList = this.state.memberEmail;
    } else if (this.state.recipients === 'Officers') {
      emailList = this.state.officerEmail;
    } else if (this.state.recipients === 'Alumni') {
      emailList = this.state.alumniEmail;
    } else if (this.state.recipients === 'Everyone') {
      emailList = this.state.allEmail;
    }

    // If statement to make sure filterUsers function is properly used
    let filterUsersError = false;
    if (emailList.length === 0) {
      filterUsersError = true;
    }
/*eslint-disable*/
    emailList.forEach(item => { console.log(item) })
    
    // Send blast email function
    // let status = await sendBlastEmail(
    //   emailList,
    //   this.state.subject,
    //   this.state.loadedContent
    // );

    // Clear form
    this.setState({
      recipients: '',
      subject: '',
      loadedContent: '',
    });

    // Alerts to notify user whether or not the email was successfully sent
    // setTimeout is used to make sure form is cleared before alert pops up
    window.setTimeout(function() {
      if (filterUsersError === true) {
        alert('Oops, could not get list of recipients!');
      } else if (status.error) {
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
          <SendButtonModal
            handleSend={this.handleSend}
            checkEmptyInputs={this.checkEmptyAllInputs}
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
