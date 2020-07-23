import React, { Component } from "react";
import Header from "../../Components/Header/Header.js";
import { FilePond } from "react-filepond";
import "filepond/dist/filepond.min.css";
import { Button } from "reactstrap";

class UploadPic extends Component {
  state = {
    files: [],
  };

    render() {
      const headerProps = {title: 'Upload Pictures'};
    return (
      <div>
        <Header {...headerProps} />
        <div className="uploadPic">
          <center>Upload pictures to the club's storage bucket here!</center>
        </div>

        <FilePond
          files={this.state.files}
          allowMultiple={false}
          acceptedFileTypes={["image/*"]}
          onupdatefiles={(fileItems) => {
            const tmp = fileItems.map((fileItem) => fileItem.file);
            console.log(tmp);
            this.setState({
              files: tmp,
            });
          }}
          labelIdle="Drag & Drop or Touch Here <br />"
        />
        <center>
          <Button color="info">Upload</Button>
        </center>
      </div>
    );
  }
}

export default UploadPic;
