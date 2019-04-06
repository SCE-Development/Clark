import React from 'react';
import Ionicon from 'react-ionicons'
import './2DPrinting.css';
import { NavbarBrand, ListGroup, ListGroupItem, ListGroupItemHeading, ListGroupItemText } from 'reactstrap';
import { Jumbotron, Button } from 'reactstrap';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

import { FilePond, registerPlugin } from "react-filepond";

// Import FilePond styles
import "filepond/dist/filepond.min.css";

// Import the Image EXIF Orientation and Image Preview plugins
// Note: These need to be installed separately
//import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
//import FilePondPluginImagePreview from "filepond-plugin-image-preview";
//import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
// Register the plugins
//registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

/*THe CONST way
const Printing = (props) => {
  return (
    <div>
      <Jumbotron>
        <h1 className="text-center"><h1 className="display-4">SCE Printing System</h1> </h1>
        <p className="text-center"><p className="lead"> Click on the icon below and upload your file </p></p>
        <p className="text-center"><p className="lead"> Printing may take up to 5 mins </p></p>
      </Jumbotron>
      <Ionicon className="ICON" icon="md-print" fontSize="400px" color="#757575"/>
     </div>
  );
}
export default Printing;
*/

export default class Printing extends React.Component{

    constructor(props) {
    super(props);

    this.state = {
    // Set initial files, type 'local' means this is a file
    // that has already been uploaded to the server (see docs)
        files: [
            {
              source: "index.html",
              options: {
                type: "local"
              }
            }
          ]
    };

    this.state = {
      modal: false,
      nestedModal: false,
      closeAll: false
    };

    this.toggle = this.toggle.bind(this);
    this.toggleNested = this.toggleNested.bind(this);
    this.toggleAll = this.toggleAll.bind(this);

    }

    toggle() {
      this.setState(prevState => ({
        modal: !prevState.modal
      }));
    }

    toggleNested() {
      this.setState({
        nestedModal: !this.state.nestedModal,
        closeAll: false
      });
    }

    toggleAll() {
      this.setState({
        nestedModal: !this.state.nestedModal,
        closeAll: true
      });
    }

    handleInit() {
      console.log("FilePond instance has initialised", this.pond);
    }

    render(){
      return (
        <div>
          <Jumbotron>
            <h1 className="text-center"><h1 className="display-4">SCE Printing System</h1> </h1>
            <p className="text-center"><p className="lead"> Click on the icon below and upload your file </p></p>
            <p className="text-center"><p className="lead"> Printing may take up to 5 mins </p></p>
          </Jumbotron>

          {/*}
          <button item-right clear onClick={this.toggle}>{this.props.buttonLabel}>
                  <ion-icon name="close-circle"></ion-icon>
          </button>
          */}

          <ion-item>
              <button clear className="ICON" onClick={this.toggle}>{this.props.buttonLabel}
                  <Ionicon icon="md-print" fontSize="400px" color="#757575"/>
              </button>
          </ion-item>

          {/*<Ionicon className="ICON" icon="md-print" fontSize="400px" color="#757575"/>*/}

          {/*<Button color="danger" onClick={this.toggle}>{this.props.buttonLabel}</Button>*/}
          <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
            <ModalHeader toggle={this.toggle}>Modal title</ModalHeader>
            <ModalBody>
              <FilePond
                ref={ref => (this.pond = ref)}
                files={this.state.files}
                allowMultiple={true}
                maxFiles={3}
                server="/api"
                oninit={() => this.handleInit()}
                onupdatefiles={fileItems => {
                  // Set currently active file objects to this.state
                  this.setState({
                    files: fileItems.map(fileItem => fileItem.file)
                  });
                }}
              />

              <br />
              <Button color="success" onClick={this.toggleNested}>Show Nested Modal</Button>
              <Modal isOpen={this.state.nestedModal} toggle={this.toggleNested} onClosed={this.state.closeAll ? this.toggle : undefined}>
                <ModalHeader>Nested Modal title</ModalHeader>
                <ModalBody>Stuff and things</ModalBody>
                <ModalFooter>
                  <Button color="primary" onClick={this.toggleNested}>Done</Button>{' '}
                  <Button color="secondary" onClick={this.toggleAll}>All Done</Button>
                </ModalFooter>
              </Modal>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onClick={this.toggle}>Do Something</Button>{' '}
              <Button color="secondary" onClick={this.toggle}>Cancel</Button>
            </ModalFooter>
          </Modal>


         </div>
      );
    }
}
