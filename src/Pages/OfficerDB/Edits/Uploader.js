import React from 'react'
const api = require('../../../APIFunctions/OfficerDB')

let file = ''

export default function Uploader () {
  return (
    <div>
      <h6>Upload an img</h6>
      <input
        onChange={event => {
          file = event.target.files[0]
        }}
        accept='image/gif, image/jpeg, image/jpg, img/png'
        type='file'
      />
    </div>
  )
}

export function upload () {
  file ? api.uploadPicture(file) : window.alert('Upload a picture')
  file = ''
}

export function checkUpload () {
  if (!file) {
    window.alert('Upload a picture')
    return false
  }
  return true
}

export function getFileName () {
  return file ? file.name : null
}
