import axios from 'axios';
import { ApiResponse } from './ApiResponses';
import {
  RPC_API_URL,
  LOGGING_API_URL,
  GENERAL_API_URL,
} from '../config/config.json';

export async function facialRekognition(file) {
  let status = new ApiResponse();
  await axios
    .post(RPC_API_URL + '/AWS_rekognition', {
      base64bytes: file.getFileEncodeBase64String(),
    })
    .then((response) => {
      status.responseData = response.data.message;
    })
    .catch((e) => {
      status.error = true;
    });
  return status;
}

export async function createNewImage(file, token) {
  let status = new ApiResponse();
  let newImage = {
    name: file.filename,
  };
  await axios
    .post(GENERAL_API_URL + '/galleryface/createImage', { token, ...newImage })
    .then((res) => {
      status.responseData = res.data;
    })
    .catch((err) => {
      status.responseData = err;
      status.error = true;
    });
  return status;
}

export async function createNewFace(face, token) {
  let status = new ApiResponse();
  let newFace = {
    id: face.id,
    name: face.name,
    top: face.top,
    left: face.left,
    width: face.width,
    height: face.height,
  };

  await axios
    .post(GENERAL_API_URL + '/galleryface/createAndAddFace', {
      token,
      ...newFace,
    })
    .then((res) => {
      status.responseData = res.data;
    })
    .catch((err) => {
      status.responseData = err;
      status.error = true;
    });
  return status;
}

export async function getImageByName(image) {
  let status = new ApiResponse();
  let search = {
    name: image.filename,
  };
  await axios
    .post(GENERAL_API_URL + '/galleryface/getImageByName', search)
    .then((res) => {
      status.responseData = res.data;
    })
    .catch((err) => {
      status.responseData = err;
      status.error = true;
    });
  return status;
}

export async function getImageByID(image) {
  let status = new ApiResponse();
  let search = {
    id: image._id,
  };
  await axios
    .post(GENERAL_API_URL + '/galleryface/getImageByID', search)
    .then((res) => {
      status.responseData = res.data;
    })
    .catch((err) => {
      status.responseData = err;
      status.error = true;
    });
  return status;
}

export async function getFaceInformation(face) {
  let status = new ApiResponse();
  let search = {
    id: face.id,
  };
  await axios
    .post(GENERAL_API_URL + '/galleryface/getFaceInformation', search)
    .then((res) => {
      status.responseData = res.data;
    })
    .catch((err) => {
      status.responseData = err;
      status.error = true;
    });
  return status;
}

export async function deleteImage(image, token) {
  let status = new ApiResponse();
  let search = {
    id: image._id,
  };
  await axios
    .post(GENERAL_API_URL + '/galleryface/deleteImage', { token, ...search })
    .then((res) => {
      status.responseData = res.data;
    })
    .catch((err) => {
      status.responseData = err;
      status.error = true;
    });
  return status;
}

export async function deleteFace(face, token) {
  let status = new ApiResponse();
  let search = {
    id: face._id,
  };
  await axios
    .post(GENERAL_API_URL + '/galleryface/deleteFace', { token, ...search })
    .then((res) => {
      status.responseData = res.data;
    })
    .catch((err) => {
      status.responseData = err;
      status.error = true;
    });
  return status;
}

export async function deleteImageAndFace(image, token) {
  for (const faceID of image.faces) {
    let search = {
      _id: faceID,
    };
    let deleteF = await deleteFace(search, token);
  }
  let final = await deleteImage(image, token);
  return final;
}
