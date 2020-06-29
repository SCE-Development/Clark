import React, { useState } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import BlastMailForm from "./BlastMailForm.jsx";
import { getAllEvents } from "../../../APIFunctions/Event.js";
export default function BlastMail(props) {
  const [toggle, setToggle] = useState(false);

  //When modal is toggled, toggle and grab events and save to 'content'
  async function onToggle() {
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
    try {
      var x = 0;
      var data = undefined;
      for (x = 0; x < events.responseData.length; x++) {
        let responseData = events.responseData[x];
        let eventDateFormatted = returnProperFormattedDate(
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
      props.updateContent(data);
    } catch (error) {}

    setToggle(!toggle);
  }

  //Used by onToggle() to format the dates from getAllEvents() to MM/DD/YYYY format
  function returnProperFormattedDate(date) {
    if (date !== null) {
      var year = date.substring(0, 4);
      return date.substring(5, date.length) + "-" + year;
    }
  }

  return (
    <React.Fragment>
      <Button onClick={onToggle}>Send Blast Mail</Button>
      <Modal size="lg" isOpen={toggle} toggle={() => setToggle(!toggle)}>
        <ModalHeader toggle={() => setToggle(!toggle)}>
          Write the Blast Mail here!
        </ModalHeader>
        <ModalBody>
          <BlastMailForm
            recipients={props.recipients}
            subject={props.subject}
            data={props.data}
            updateRecipients={props.updateRecipients}
            updateSubject={props.updateSubject}
            updateData={props.updateData}
            content={props.content}
            loadedContent={props.loadedContent}
            handleEditorChange={props.handleEditorChange}
          />
        </ModalBody>
        <ModalFooter>
          <Button
            color="warning"
            onClick={props.handleClear}
            disabled={checkEmpty()}
          >
            Clear
          </Button>
          <Button
            color="secondary"
            onClick={props.handleLoadContent}
            disabled={checkLoadedContent()}
          >
            Load Template
          </Button>

          <Button
            color="primary"
            onClick={async () => {
              await handleSubmit();
            }}
            disabled={!checkEmptyInputs()}
          >
            Send
          </Button>
          {/* <Button color="secondary" onClick={() => setToggle(!toggle)}>
            Cancel
          </Button> */}
        </ModalFooter>
      </Modal>
    </React.Fragment>
  );
}
