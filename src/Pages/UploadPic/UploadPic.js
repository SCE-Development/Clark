import React, { Component } from 'react';
import Header from '../../Components/Header/Header.js';
import { FilePond, registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import { Button } from 'reactstrap';
import { uploadToS3 } from '../../APIFunctions/S3Bucket';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
/* eslint-disable-next-line */
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css';
import './UploadPic.css';
registerPlugin(FilePondPluginImagePreview);

class UploadPic extends Component {
  constructor() {
    super();
    this.state = {
      success: false,
      files: [],
    };
  }

  handleUpload = async () => {
    const response = await uploadToS3(this.state.files);
    if (!response.error) {
      this.setState({ success: true });
    }
  };

  render() {
    const SuccessMessage = () => (
      <div>
        <h3 className='success-message'>Successfully uploaded files</h3>
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
              files: tmp,
            });
          }}
          labelIdle="<h3 class='s3-header'>Drag & Drop or Touch Here</h3>
            <svg class='upload-icon'viewBox='0 -50 1000 1000'>
            <path d='M871.1,0H108.9C49,0,0,49,0,108.9v517.3c0,59.9,49,108.9,
          108.9,108.9h762.2c59.9,0,108.9-49,108.9-108.9V108.9
          C980,49,931,0,871.1,0z M939.2,614.8c0,54.9-24.5,79.4-79.4,
          79.4H120.3c-54.9,0-79.4-24.5-79.4-79.4V120.2
          c0-54.9,24.5-79.4,79.4-79.4h739.5c54.9,0,79.4,24.5,79.4,
          79.4V614.8z M306.3,285.8l102,81.7l265.4-224.6l204.2,183.8V633H102.1
          V449.2L306.3,285.8z M183.8,102.1c-45.1,0-81.7,36.6-81.7,81.7s36.6,
          81.7,81.7,81.7s81.7-36.6,81.7-81.7S228.9,102.1,183.8,102.1z'/>
            </svg>"
        />
        <center>
          <Button
            className='upload-button'
            onClick={this.handleUpload.bind(this)}
          >
            Upload
          </Button>
          <br />
        </center>
        <center>{this.state.success ? <SuccessMessage /> : true}</center>
        <br />
      </React.Fragment>
    );
  }
}

export default UploadPic;
