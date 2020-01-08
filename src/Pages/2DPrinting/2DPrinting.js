import React from 'react'
import './2D-printing.css'
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
} from 'reactstrap'
import { FilePond } from 'react-filepond'

// Import FilePond styles
import 'filepond/dist/filepond.min.css'

export default class Printing extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      // Set initial files, type 'local' means this is a file
      // that has already been uploaded to the server (see docs)
      files: [
        {
          source: 'index.html',
          options: {
            type: 'local'
          }
        }
      ]
    }

    this.state = {
      modal: false,
      nestedModal: false,
      closeAll: false
    }

    this.handleToggle = this.handleToggle.bind(this)
    this.handleToggleNested = this.handleToggleNested.bind(this)
    // this.toggleAll = this.toggleAll.bind(this)
  }

  handleToggle () {
    this.setState(prevState => ({
      modal: !prevState.modal
    }))
  }

  handleToggleNested () {
    this.setState({
      nestedModal: !this.state.nestedModal,
      closeAll: false
    })
  }

  // toggleAll () {
  //   this.setState({
  //     nestedModal: !this.state.nestedModal,
  //     closeAll: true
  //   })
  // }

  handleInit () {
    console.log('FilePond instance has initialised', this.pond)
  }

  render () {
    return (
      <>
        <Jumbotron>
          <div className='text-center'>
            <h1 className='display-4'>SCE Printing System</h1>{' '}
          </div>
          <div className='text-center'>
            <p className='lead'>
              {' '}
              Click on the icon below and upload your file{' '}
            </p>
          </div>
          <div className='text-center'>
            <p className='lead'> Printing may take up to 5 mins </p>
          </div>
        </Jumbotron>

        {/* }
          <button item-right clear onClick={this.toggle}>{this.props.buttonLabel}>
                  <ion-icon name="close-circle"></ion-icon>
          </button>
          */}

        <button className='ICON' onClick={this.handleToggle}>
          {this.props.buttonLabel}

          <svg width='200px' height='200px' viewBox='0 0 24 24'>
            <path
              fill='#757575'
              d='M4.93,3.92L6.34,5.33C9.46,2.2 14.53,2.2 17.66,5.33L19.07,3.92C15.17,0 8.84,0 4.93,3.92M7.76,6.75L9.17,8.16C10.73,6.6 13.26,6.6 14.83,8.16L16.24,6.75C13.9,4.41 10.1,4.41 7.76,6.75M19,14A1,1 0 0,1 18,13A1,1 0 0,1 19,12A1,1 0 0,1 20,13A1,1 0 0,1 19,14M16,20H8V15H16V20M19,10H5A3,3 0 0,0 2,13V18H6V22H18V18H22V13A3,3 0 0,0 19,10Z'
            />
          </svg>
        </button>

        {/* <Ionicon className="ICON" icon="md-print" fontSize="400px" color="#757575"/> */}
        {/* <Button color="danger" onClick={this.toggle}>{this.props.buttonLabel}</Button> */}

        <Modal
          isOpen={this.state.modal}
          toggle={this.toggle}
          className={this.props.className}
        >
          <ModalHeader toggle={this.toggle}>
            Software & Computer Engineering Society
          </ModalHeader>
          <ModalBody>
            <FilePond
              ref={ref => (this.pond = ref)}
              files={this.state.files}
              allowMultiple
              maxFiles={3}
              maxFileSize='10MB'
              server={this.serverOptions}
              oninit={() => this.handleInit()}
              onupdatefiles={fileItems => {
                // Set currently active file objects to this.state
                this.setState({
                  files: fileItems.map(fileItem => fileItem.file)
                })
              }}
            />

            <br />

            <FormGroup>
              {/* <Label for="exampleSelect">Number of copies</Label> */}
              <legend for='exampleSelect'>Number of copies</legend>
              <Input type='select' name='select' id='exampleSelect'>
                <option>1</option>
                <option>2</option>
                <option>3</option>
                <option>4</option>
                <option>5</option>
              </Input>
              <legend>Type of Print</legend>
              <FormGroup check>
                <Label check>
                  <Input type='radio' name='radio1' /> Front
                </Label>
              </FormGroup>
              <FormGroup check>
                <Label check>
                  <Input type='radio' name='radio1' />{' '}
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
            <Button color='success' onClick={this.handleToggleNested}>
              Print!
            </Button>
            <Modal
              isOpen={this.state.nestedModal}
              toggle={this.toggleNested}
              onClosed={this.state.closeAll ? this.toggle : undefined}
            >
              <ModalHeader>Nested Modal title</ModalHeader>
              <ModalBody>Stuff and things</ModalBody>
              <ModalFooter>
                <Button color='success' onClick={this.handleToggleNested}>
                  Yes!
                </Button>{' '}
                <Button color='danger' onClick={this.handleToggleNested}>
                  Go Back
                </Button>
              </ModalFooter>
            </Modal>
          </ModalFooter>
        </Modal>
      </>
    )
  }
}
