import React, { Component } from 'react';
import Header from '../../Components/Header/Header.js';
import { FilePond, registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import { Button } from 'reactstrap';
import { uploadToS3 } from '../../APIFunctions/S3Bucket';
import {
  createNewFace,
  createNewImage,
  facialRekognition,
  getImageByName,
  getImageByID,
  getFaceInformation,
  deleteImage,
  deleteFace,
  deleteImageAndFace,
} from '../../APIFunctions/AWSRekognition';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
/* eslint-disable-next-line */
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css';
import './UploadPic.css';
registerPlugin(FilePondPluginImagePreview);

class UploadPic extends Component {
  constructor(props) {
    super();
    this.state = {
      success: false,
      labelsuccess: 0,
      files: [],
      bytes: [],
    };
    this.token = props.user.token;
  }

  handleUpload = async () => {
    /* =========================
    Uploading Image to S3 bucket
    ========================= */
    // const response = await uploadToS3(this.state.files);
    // if (!response.error) {
    //   this.setState({ ...this.state, success: true });
    // }
    /* ====================
    Labeling Faces with AWS
    ==================== */
    if (document.getElementById('labelface').checked) {
      this.setState({ ...this.state, labelsuccess: 2 });
      window.scrollTo(0, document.getElementById('labelMessage').clientTop);
      let failed = [];
      for (const file of this.state.bytes) {
        const status = await this.handleFacialRecognition(file);
        if (!status) {
          failed.push(file.filename);
        }
      }
      if (failed.length) {
        alert('Face Rekognition failed for:\n - ' + failed.join('\n - '));
        this.setState({ labelsuccess: 3 });
      } else {
        alert('Face Rekognition Successful!!');
        this.setState({ labelsuccess: 1 });
      }
    }
  };

  handleFacialRecognition = async (file) => {
    /* ===============
    Facial Rekognition
    =============== */
    const status = await facialRekognition(file);
    if (status.error) return;
    // eslint-disable-next-line no-console
    console.log('status', status);
    let array = status.responseData.array[0];
    const width = status.responseData.array[1];
    const height = status.responseData.array[2];

    /* ==================
    Creating GalleryImage
    ================== */
    let imageFile = {
      name: file.filename,
      width: width,
      height: height,
    };
    let Gimage = await createNewImage(imageFile, this.token);

    /* ============================
    Adding and creating GalleryFace
    ============================ */
    let id = Gimage.responseData._id;
    for (let i = 0; i < array.length; i++) {
      let newFace = {
        id: id,
        name: array[i][0],
        top: array[i][1],
        left: array[i][2],
        width: array[i][3],
        height: array[i][4],
      };

      let temp = await createNewFace(newFace, this.token);
    }

    /* ==================
    Getting Image By Name
    ================== */
    // let image = await getImageByName(file);

    /* ================
    Getting Image By ID
    ================ */
    // let imageById = await getImageByID(image.responseData);

    /* ===============
    Getting Face By id
    =============== */
    // let faces = image.responseData.faces;
    // for (const faceID of faces) {
    //   let faceInfo = await getFaceInformation({ id: faceID });
    // }

    /* ==========
    Deleting Face
    ========== */
    // for (const faceID of faces) {
    //   let deleted = await deleteFace({ _id: faceID }, this.token);
    // }

    /* ===========
    Deleting Image
    =========== */
    // let deleting = await deleteImage(image.responseData, this.token);

    /* =====================
    Deleting Image and faces
    ===================== */
    // let dele = await deleteImageAndFace(image.responseData, this.token);

    return !status.error;
  };

  render() {
    const SuccessMessage = () => (
      <div>
        <h3 className='success-message'>Successfully uploaded files</h3>
      </div>
    );

    const LabelSuccessMessage = () => (
      <div>
        <h3 className='success-message'>
          Successfully labeled faces in files!
        </h3>
      </div>
    );
    const LabelWaitingMessage = () => (
      <div>
        <h3 className='labeling-message'>Labeling Faces ...</h3>
      </div>
    );
    const LabelFailedMessage = () => (
      <div>
        <h3 className='fail-message'>Failed to label faces in files...</h3>
      </div>
    );

    const headerProps = { title: 'Upload Pictures' };
    return (
      <React.Fragment>
        <Header {...headerProps} />
        <div className='uploadPic'>
          <center className='upload-sub-header'>
            Upload pictures to the club's storage bucket here!
          </center>
        </div>
        <br />
        <FilePond
          type='file'
          files={this.files}
          allowMultiple={true}
          acceptedFileTypes={['image/*']}
          onupdatefiles={(fileItems) => {
            const tmp = fileItems.map((fileItem) => fileItem.file);
            this.setState({
              ...this.state,
              files: tmp,
              bytes: fileItems,
            });
          }}
          labelIdle="<h3 class='s3-header'>Drag & Drop or Touch Here</h3>
            <svg class='upload-icon'viewBox='0 -50 1000 1000'>
              <path d='M871.1,0H108.9C49,0,0,49,0,108.9v517.3c0,59.9,49,108.9,
                108.9,108.9h762.2c59.9,0,108.9-49,108.9-108.9V108.9
                C980,49,931,0,871.1,0z M939.2,614.8c0,54.9-24.5,79.4-79.4,
                79.4H120.3c-54.9,0-79.4-24.5-79.4-79.4V120.2
                c0-54.9,24.5-79.4,79.4-79.4h739.5c54.9,0,79.4,24.5,79.4,
                79.4V614.8z M306.3,285.8l102,
                81.7l265.4-224.6l204.2,183.8V633H102.1
                V449.2L306.3,285.8z M183.8,102.1c-45.1,0-81.7,
                36.6-81.7,81.7s36.6,
                81.7,81.7,81.7s81.7-36.6,81.7-81.7S228.9,102.1,183.8,102.1z'/>
            </svg>"
        />
        <center>
          <input type='checkbox' id='labelface' name='labelface' />
          <label htmlFor='labelface'>Label Faces</label>
        </center>
        <center>
          <Button
            className='upload-button'
            onClick={this.handleUpload.bind(this)}
          >
            Upload
          </Button>
          <br />
        </center>
        <center id='labelMessage'>
          {this.state.labelsuccess == 1 ? (
            <LabelSuccessMessage />
          ) : this.state.labelsuccess == 2 ? (
            <LabelWaitingMessage />
          ) : this.state.labelsuccess == 3 ? (
            <LabelFailedMessage />
          ) : (
            true
          )}
        </center>
        <center>{this.state.success ? <SuccessMessage /> : true}</center>
        <br />
      </React.Fragment>
    );
  }
}

export default UploadPic;
