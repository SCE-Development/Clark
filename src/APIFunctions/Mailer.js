import axios from "axios";
import { ApiResponse } from "./ApiResponses";
import { MAILER_API_URL } from "../config/config.json";

/**
 * Invoke the gmail API to send an email to verify a user.
 * @param {string} email - The user's email
 * @param {string} firstName - The user's first name
 * @returns {ApiResponse} Containing any error information related to the
 * request
 */
export async function sendVerificationEmail(email, firstName) {
  let status = new ApiResponse();
  console.log("sending email..? email: ", email, "first name: ", firstName);
  console.log("mailer api url: ", MAILER_API_URL);
  await axios
    .post(MAILER_API_URL + "/api/Mailer/sendVerificationEmail", {
      recipientEmail: email,
      recipientName: firstName,
    })
    .then((response) => {
      console.log("Response? ", response.data);
    })
    .catch((error) => {
      status.error = true;
      status.responseData = error;
      console.log("Wrong: ", error);
    });
  return status;
}

export async function sendBlastEmail(emailList, subject, content) {
  let status = new ApiResponse();
  // console.log("email: ", emailList);
  // console.log("subject: ", subject);
  // console.log("content: ", content);
  // console.log("mailer api url: ", MAILER_API_URL);
  await axios
    .post(MAILER_API_URL + "/api/Mailer/sendBlastEmail", {
      recipientEmail: emailList,
      blastSubject: subject,
      blastContent: content,
    })
    .then((response) => {
      console.log("Response? ", response.data);
    })
    .catch((error) => {
      status.error = true;
      status.responseData = error;
      console.log("Wrong: ", error);
    });
  return status;
}
