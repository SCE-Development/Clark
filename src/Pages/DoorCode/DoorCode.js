import React, { Component } from 'react';
import './DoorCode.css';
import DoorCodeProfile from './DoorCodeProfile';
import {
  Button,
  FormGroup,
  FormText,
  FormFeedback,
  Form,
  Input,
  Modal,
  Label,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Table,
} from 'reactstrap';
import {
  getAllDoorCodes,
  createNewDoorCode,
  editDoorCode,
  deleteDoorCode,
} from '../../APIFunctions/DoorCode';
import Header from '../../Components/Header/Header';
import PlusSym from '../DoorCode/add_symbol.png';
import DeleteSym from '../DoorCode/delete_time.png';
import { assertInteger } from 'pdf-lib';

export default class DoorCodeTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      doorCodes: [],
      currentQueryType: 'All',
      queryResult: [],
      toggleDelete: false,
      toggleEdit: false,
      toggleMult: false,
      toggleMassDelete: false,
      inputSeq: '',
      inputMult: '',
      inputDate: '',
      multError: false,
      dateError: false,
      multErrorMsg: '',
    };
    this.headerProps = {
      title: 'Door Codes'
    };
  }

  componentDidMount() {
    if (this.props.user) {
      this.setState(
        {
          authToken: this.props.user.token,
          currentUser: this.props.user.email,
          currentUserLevel: this.props.user.accessLevel
        },
        () => {
          this.callDoorCodes();
        }
      );
    }
  }

  async callDoorCodes() {
    const apiResponse = await getAllDoorCodes(this.state.authToken);

    if (!apiResponse.error) this.setState({
      doorCodes: apiResponse.responseData });
  }

  updateQuery(value) {
    const doorcodeExists = code => {
      return (
        code.doorCode.includes(value) ||
        code.doorCodeValidUntil.includes(value) ||
        code.userEmails.join(', ').includes(value)
      );
    };

    const allFilteredDoorCodes = this.state.doorCodes;
    const searchResult = allFilteredDoorCodes.filter(data =>
      doorcodeExists(data));
    const queryResult = searchResult;
    this.setState({ queryResult });
  }

  handleInput = (e) => {
    e.preventDefault();
    const inputSeq = e.target.value;
    this.setState({ inputSeq });
  }

  handleMult = (e) => {
    e.preventDefault();
    const inputMult = e.target.value;
    this.setState({ inputMult });
    if(this.state.multError)
      this.setState({multError: false});
  }

  handleDate = (e) => {
    e.preventDefault();
    const inputDate = e.target.value;
    this.setState({ inputDate });
    if(this.state.dateError)
      this.setState({dateError: false});
  }

  createDoor = async (input, dateInput) => {
    const VALID_NEW_CODE = {
      doorCode: input,
      doorCodeValidUntil: new Date(dateInput),
      userEmails: [],
    };
    const newDoorCodeData = await createNewDoorCode(VALID_NEW_CODE,
      this.props.user.token);
    if (!newDoorCodeData.error) {
      window.location.reload(false);
    }
  }

  createMultDoor = async (input, dateInput) => {
    const perCode = input.split('\n');
    let err = false;
    let formattedCodes = [];
    perCode.forEach((code) => {
      code = code.replace(/[^0-9]/g, '');
      if(code.length == 7) {
        formattedCodes.push(code.slice(0, 3) + '-' + code.slice(3, 7));
      } else if(code.length != 0){
        err = true;
        this.setState({multError: err});
        this.setState({multErrorMsg: 'Check doorcode length of ' + code});
      }
    });

    formattedCodes.forEach((code) => {
      if(this.doorCodeExists(code, formattedCodes)){
        err=true;
        this.setState({multError: err});
        this.setState({multErrorMsg: 'Doorcode ' + code + ' already exists!'});
      }
      if(Date.parse(dateInput) < Date.now() || dateInput===''){
        err=true;
        this.setState({dateError: err});
      }
    });

    if(!err){
      formattedCodes.forEach((code) => {
        this.createDoor(code, dateInput);
      });
    }
  }

  doorCodeExists = (doorCodeToAdd, existingDoorCodes) => {
    let counter = 0;
    let totalDoorCodes = existingDoorCodes;
    this.state.doorCodes.forEach((d) => {
      totalDoorCodes.push(d.doorCode);
    });
    totalDoorCodes.forEach((doorCode) => {
      if(doorCodeToAdd == doorCode){
        counter++;
      }
    });
    return counter > 1;
  }

  deleteDoor = async (input) => {
    const deleteDoorCodeData = await deleteDoorCode(input,
      this.props.user.token);
    if (!deleteDoorCodeData.error) {
      window.location.reload(false);
    }
  }

  deleteAllExpiredDoor = async () => {
    const allCodesData = await getAllDoorCodes(this.state.authToken);
    let currentDate = new Date();
    const filteredData = allCodesData.responseData.filter(code =>
      code.doorCodeValidUntil <= currentDate.toISOString());
    filteredData.map((dCode) => {
      return this.deleteDoor(dCode);
    });
  }

  editDoor = async (doorInput, newSeq, newDate) => {
    doorInput.doorCode = newSeq;
    doorInput.doorCodeValidUntil = newDate;
    const editDoorCodeData = await editDoorCode(doorInput,
      this.props.user.token);
    if (!editDoorCodeData.error) {
      window.location.reload(false);
    }
  }

  convertDateFormat = (unformattedDate) => {
    if (!unformattedDate) return;
    const [year, month, day] = unformattedDate.split('-');
    return [month, day, year].join('/');
  }

  clearMult = () => {
    this.setState({inputMult: '', inputDate: '',
      multError: false, dateError: false});
  }

  render() {
    return (
      <div>
        <Header {...this.headerProps}/>

        <div className='layout-inv'>

          <div>
            <input
              className='input-overview-inv'
              placeholder="Search by 'Door Code, or User Email'"
              onChange={event => {
                this.updateQuery(event.target.value);
              }}
            />

            <button
              className='button-inv'
              onClick={() => {
                this.setState({ toggleMult: true });
                this.clearMult();
              }}
            >
              <img id='button-image' src={PlusSym} alt={'sce logo'} />
            </button>

            <button
              className='button-inv-delete'
              onClick={() => {
                this.setState({ toggleMassDelete: true });
              }}
            >
              <img id='button-image' src={DeleteSym} alt={'sce logo'} />
            </button>
          </div>

          <Table responsive className='content-table-inv' id='users'>
            <thead>
              <tr>
                {[
                  'Door Code',
                  'Expiration Date',
                  'User Emails',
                  'Delete',
                  'Edit'
                ].map((ele, ind) => {
                  if (ele === 'User Emails') {
                    return <th className='content-table-emails'
                      key={ind}>{ele}</th>;
                  }
                  return <th key={ind}>{ele}</th>;
                })}
              </tr>
            </thead>

            <tbody>
              {this.state.queryResult.length > 0
                ? this.state.queryResult.map((code, index) => {
                  let emailOutput = code.userEmails.join(', ');
                  if (emailOutput === '') {
                    emailOutput = 'None Assigned';
                  }
                  return (
                    <DoorCodeProfile
                      key={index}
                      code={code}
                      doorcode={code.doorCode}
                      expire={this.convertDateFormat(
                        code.doorCodeValidUntil.split('T')[0])}
                      emails={ emailOutput }
                      deleteDoor={this.deleteDoor.bind(this)}
                      updateQuery={() => {
                        this.setState(
                          { currentQueryType: 'All', queryResult: [] },
                          this.updateQuery('#InvalidSearch#')
                        );
                      }}
                    />
                  );
                })
                : this.state.doorCodes.map((code, index) => {
                  let emailOutput = code.userEmails.join(', ');
                  if (emailOutput === '') {
                    emailOutput = 'None Assigned';
                  }
                  return (
                    <DoorCodeProfile
                      key={index}
                      code={code}
                      doorcode={code.doorCode}
                      expire={this.convertDateFormat(
                        code.doorCodeValidUntil.split('T')[0])}
                      emails={ emailOutput }
                      deleteDoor={this.deleteDoor.bind(this)}
                      editDoor={this.editDoor.bind(this)}
                      updateQuery={() => {
                        this.setState(
                          { currentQueryType: 'All', queryResult: [] },
                          this.updateQuery('#InvalidSearch#')
                        );
                      }}
                    />
                  );
                })}
            </tbody>
          </Table>

          <Modal
            isOpen={this.state.toggleMult}
            toggle={()=>{
              this.setState({toggleMult: !this.state.toggleMult});
            }}
          >
            <ModalHeader
              toggle={()=>{
                this.setState({toggleMult: !this.state.toggleMult});
              }}
            >
              Add Doorcode(s)
            </ModalHeader>
            <ModalBody>
              <Form>
                <FormGroup>
                  <Label>
                    Doorcode(s)
                    <p style={{color: 'red', display: 'inline'}}> *</p>
                    <FormText color='muted'>
                      7 numbers per doorcode. Add multiple by line.
                      No duplicates.
                    </FormText>
                  </Label>
                  <Input
                    type='textarea'
                    rows={10}
                    placeholder=''
                    onChange={this.handleMult}
                    invalid={this.state.multError}
                  />
                  <FormFeedback invalid='true'>
                    {this.state.multErrorMsg}
                  </FormFeedback>
                </FormGroup>
                <FormGroup>
                  <Label>
                    Expiration Date
                    <p style={{color: 'red', display: 'inline'}}> *</p>
                    <FormText color='muted'>
                      Enter a valid date.
                    </FormText>
                  </Label>
                  <Input
                    type='Date'
                    onChange={this.handleDate}
                    invalid={this.state.dateError}
                  />
                </FormGroup>
              </Form>
            </ModalBody>
            <ModalFooter>
              <Button
                color='primary'
                onClick={() => {
                  this.createMultDoor(this.state.inputMult,
                    this.state.inputDate);
                  this.updateQuery();
                }}
              >
                Add Door Codes
              </Button>
              <Button
                color='secondary'
                onClick={() => {
                  this.updateQuery();
                  this.setState({ toggleMult: false });
                }}
              >
                Cancel
              </Button>
            </ModalFooter>
          </Modal>

          <Modal
            isOpen={this.state.toggleMassDelete}
            toggle={()=>{
              this.setState({toggleMassDelete: !this.state.toggleMassDelete});
            }}
          >
            <ModalBody>
              <Label>Delete all expired door codes?</Label>
            </ModalBody>
            <ModalFooter>
              <Button
                color='primary'
                onClick={() => {
                  this.deleteAllExpiredDoor();
                  this.updateQuery();
                  this.setState({ toggleAdd: false });
                }}
              >
                Delete All
              </Button>
              <Button
                color='secondary'
                onClick={() => {
                  this.updateQuery();
                  this.setState({ toggleMassDelete: false });
                }}
              >
                Cancel
              </Button>
            </ModalFooter>
          </Modal>

        </div>
      </div>
    );
  }
}
