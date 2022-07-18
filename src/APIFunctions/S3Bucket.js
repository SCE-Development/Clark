import axios from 'axios';
import { ApiResponse } from './ApiResponses';

let MAILER_API_URL = process.env.REACT_APP_MAILER_API_URL
  || 'http://localhost:8082/cloudapi';

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
