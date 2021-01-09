import axios from 'axios';
import { ApiResponse } from './ApiResponses';

let config = require('../config/config.json');
let MAILER_API_URL = process.env.NODE_ENV === 'production' ?
  config.MAILER_API_URL_PROD : config.MAILER_API_URL;

/**
 * Return a url of the uploaded file from AWS
 * @param {Array} files
 * @returns {ApiResponse} Returns if file is uploaded successfully
 */
export function uploadToS3(files) {
  let uploadResult = new ApiResponse();
  let signedUrlResult = new ApiResponse();
  return files.map(file => {
    let fileParts = file.name.split('.');
    let fileName = fileParts[0];
    let fileType = fileParts[1];

    // Retrieving signed url which will allow us to make an upload request to S3
    axios
      .post(MAILER_API_URL + '/S3Bucket/getSignedUrl', {
        fileName,
        fileType
      })
      .then((response) => {
        signedUrlResult = response.data;
        const returnData = response.data.url;
        const signedRequest = returnData.signedRequest;

        const options = {
          headers: {
            'Content-Type': fileType,
          },
        };

        // Making an upload request by passing in the signed url
        // and the file that we want to upload
        axios
          .put(signedRequest, file, options)
          .then((res) => {
            uploadResult.responseData = res.data;
            return uploadResult;
          })
          .catch((error) => {
            uploadResult.error = true;
            return error;
          });
      })
      .catch((error) => {
        signedUrlResult.error = true;
        return error;
      });
    return signedUrlResult;
  });
}

/**
 * Return a url of the requested file from AWS
 * @param {String} fileName
 * @returns {ApiResponse} Returns if file is retrieved successfully
 */
export async function getFileFromS3(fileName) {
  let status = new ApiResponse();
  await axios.post(MAILER_API_URL + '/S3Bucket/getSignedUrl', { fileName })
    .then((res) => {
      status.responseData = res.data;
    })
    .catch((error) => {
      status.error = true;
      status.responseData = error;
    });
  return status;
}

/**
 * Return an array of fileNames in the AWS bucket
 * @param {String} prefix
 * @returns {ApiResponse} Returns if list of files is retrieved successfully
 */
export async function getListOfFiles(prefix) {
  let status = new ApiResponse();
  await axios.post(MAILER_API_URL + '/S3Bucket/getListOfFiles', { prefix })
    .then((res) => {
      status.responseData = res.data;
    })
    .catch((error) => {
      status.error = true;
      status.responseData = error;
    });
  return status;
}
