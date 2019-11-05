import React from "react";
import Ionicon from "react-ionicons";
import "./2DPrinting.css";
import {
  // NavbarBrand,
  // ListGroup,
  // ListGroupItem,
  // ListGroupItemHeading,
  // ListGroupItemText
  Jumbotron,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormGroup,
  Label,
  Input
} from "reactstrap";

import { FilePond } from "react-filepond";

// Import FilePond styles
import "filepond/dist/filepond.min.css";
import { doWhileStatement } from "@babel/types";

export default class Printing extends React.Component {
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

    this.handleToggle = this.handleToggle.bind(this);
    this.handleToggleNested = this.handleToggleNested.bind(this);

    // this.toggleAll = this.toggleAll.bind(this)
  }

  handleToggle() {
    this.setState(prevState => ({
      modal: !prevState.modal
    }));
  }

  handleToggleNested() {
    this.setState({
      nestedModal: !this.state.nestedModal,
      closeAll: false
    });
  }

  componentWillMount() {
    document.addEventListener("mousedown", this.handleClickOutside);
  }
  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
  }
  handleClickOutside(event) {}

  // toggleAll () {
  //   this.setState({
  //     nestedModal: !this.state.nestedModal,
  //     closeAll: true
  //   })
  // }

  handleInit() {
    console.log("FilePond instance has initialised", this.pond);
  }

  render() {
    return (
      <div>
        <Jumbotron>
          <div className="text-center">
            <h1 className="display-4">SCE Printing System</h1>{" "}
          </div>
          {/*}
          <div className='text-center'>
            <p className='lead'>
              {' '}
              Click on the icon below and upload your file{' '}
            </p>
          </div>
          <div className='text-center'>
            <p className='lead'> Printing may take up to 5 mins </p>
          </div>*/}
        </Jumbotron>
        {/* }
          <button item-right clear onClick={this.toggle}>{this.props.buttonLabel}>
                  <ion-icon name="close-circle"></ion-icon>
          </button>
          */}
        {/* <section>
            <div className="pages">
              <div><img src={require ('./papers/paper1.png')}></img></div>
              <div><img src={require ('./papers/paper2.png')}></img></div>
              <div><img src={require ('./papers/paper3.png')}></img></div>
              <div><img src={require ('./papers/paper4.png')}></img></div>
            </div>
          </section> */}
        <div className="printInfo">
          {/*<h1>SCE Printing System</h1>*/}
          <p>
            Welcome to printing! Click the icon below and upload your file. Each
            member can print up to 30 pages a week.
          </p>
        </div>

        {this.props.buttonLabel}
        <FilePond
          ref={ref => (this.pond = ref)}
          files={this.state.files}
          allowMultiple={true}
          maxFiles={3}
          maxFileSize="10MB"
          server={this.serverOptions}
          oninit={() => this.handleInit()}
          onupdatefiles={fileItems => {
            // Set currently active file objects to this.state
            this.setState({
              files: fileItems.map(fileItem => fileItem.file)
            });
          }}
          labelIdle='Drag & Drop or Touch Here
              <svg aria-hidden="true" viewBox="0 0 512 512">
                <path
                  d="M399.95 160h-287.9C76.824 160 48 188.803 48 
                224v138.667h79.899V448H384.1v-85.333H464V224c0-35.197-28.825-64-64.05-64zM352 
                416H160V288h192v128zm32.101-352H127.899v80H384.1V64z"
                />
              </svg>'
        />
        <Button
          color="primary"
          className="continue"
          onClick={this.handleToggle}
        >
          continue
        </Button>
        {/* <Ionicon className="ICON" icon="md-print" fontSize="400px" color="#757575"/> */}
        {/* <Button color="danger" onClick={this.toggle}>{this.props.buttonLabel}</Button> */}
        <Modal
          isOpen={this.state.modal}
          toggle={this.handleToggle}
          className={this.props.className}
          onClosed={this.state.closeAll ? this.toggle : undefined}
        >
          <ModalHeader toggle={this.handleToggle}>
            Software & Computer Engineering Society
          </ModalHeader>
          <ModalBody>
            {/* <FilePond
              ref={ref => (this.pond = ref)}
              files={this.state.files}
              allowMultiple
              maxFiles={3}
              maxFileSize="10MB"
              server={this.serverOptions}
              oninit={() => this.handleInit()}
              onupdatefiles={fileItems => {
                // Set currently active file objects to this.state
                this.setState({
                  files: fileItems.map(fileItem => fileItem.file)
                });
              }}
            /> */}

            <br />

            <FormGroup>
              {/* <Label for="exampleSelect">Number of copies</Label> */}
              <legend for="exampleSelect">Number of copies</legend>
              <Input type="select" name="select" id="exampleSelect">
                <option>1</option>
                <option>2</option>
                <option>3</option>
                <option>4</option>
                <option>5</option>
              </Input>
              <legend>Type of Print</legend>
              <FormGroup check>
                <Label check>
                  <Input type="radio" name="radio1" /> Front
                </Label>
              </FormGroup>
              <FormGroup check>
                <Label check>
                  <Input type="radio" name="radio1" />{" "}
                  {/* add disabled if in need of option disablement */}
                  Front & Back
                </Label>
              </FormGroup>
            </FormGroup>
            <Label> Note: All prints are black ink only</Label>
          </ModalBody>
          <ModalFooter>
            {/* <Button color="primary" onClick={this.toggle}>Do Something</Button>{' '}
              <Button color="secondary" onClick={this.toggle}>Cancel</Button> */}
            {/*WORKING HERE*/}
            <Button color="danger" onClick={this.handleToggle}>
              Back
            </Button>
            <Button color="success" onClick={this.handleToggleNested}>
              Print!
            </Button>
            <Modal
              isOpen={this.state.nestedModal}
              toggle={this.handleToggleNested}
              onClosed={this.state.closeAll ? this.toggle : undefined}
            >
              <ModalHeader toggle={this.handleToggleNested}>
                Are you sure you want to print?
              </ModalHeader>
              <ModalBody>Click Yes or Go Back</ModalBody>
              <ModalFooter>
                <Button color="success" onClick={this.handleToggleNested}>
                  Yes!
                </Button>{" "}
                <Button color="danger" onClick={this.handleToggleNested}>
                  Go Back
                </Button>
              </ModalFooter>
            </Modal>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}
