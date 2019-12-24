import React, { Component } from "react";
//import "./profile.css";
import {
  Container,
  Badge,
  Button,
  Row,
  Col,
  FormGroup,
  Form,
  Input,
  FormText,
  Modal,
  Label,
  ModalBody,
  ModalFooter,
  ModalHeader
} from "reactstrap";
import axios from 'axios'

class ProfilePage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: {},
      temp: {},
      toggle: false,
      toggleSubmit: false,
      usernameCheck: false,
    };
  }

  componentWillMount(){
    this.setState({user:{...this.props.user}},
      this.setState({temp:{...this.props.user}})
    )
  }

  handleToggle(){
    this.setState({temp:{...this.props.user}},
      this.setState({toggle: !this.state.toggle})
    )
  }

  handleSubmission(){
    const queryEmail = this.state.user.email

    this.setState({user:{...this.state.temp}},
      this.setState({toggle:!this.state.toggle},
        ()=>{
          axios
            // get all user!
            .post('/api/user/edit', {
              ...this.state.user,
              queryEmail: queryEmail,
              token: this.props.token
            })
            .then(result => {
              if (result.status >= 200 && result.status < 300) {
                this.setState({ users: result.data })
              }
            })
            .catch(err => {
              console.log(err)
            })
            this.handleSubmissionToggle()
        }
      )
    )
  }

  handleSubmissionToggle()
  {
    if (this.state.user.email === this.state.temp.email)
      this.setState({toggleSubmit: !this.state.toggleSubmit})
    else
    {
      this.checkIfUserExists(this.state.temp.email)
    }
  }

  checkIfUserExists (val) {
    axios
      .post('/api/user/checkIfUserExists', { email: val })
      .then(result => {
        if (result.status >= 200 && result.status < 300) {
          this.setState({
            usernameCheck: true,
            toggleSubmit: !this.state.toggleSubmit
          })
        }
      })
      .catch(err => {
        window.alert('The Email has already existed, leave it blank if you do not want to change')
        console.log(err)
      })
  }

  change(event, id) {
    id === "firstName" &&
      this.setState({
        temp: {
          ...this.state.temp,
          firstName: event.target.value
        }
      });
    id === "lastName" &&
      this.setState({
        temp: {
          ...this.state.temp,
          lastName: event.target.value
        }
      });
    id === "middleInitial" &&
      this.setState({
        temp: {
          ...this.state.temp,
          middleInitial: event.target.value
        }
      });
    (id === "email" && event.target.value.trim()!=='') &&
      this.setState({
        temp: {
          ...this.state.temp,
          email: event.target.value
        }
      });
    (id === "password" && event.target.value.trim()!=='') &&
      this.setState({
        temp: {
          ...this.state.temp,
          password: event.target.value
        }
      });
    id === "doorCode" &&
      this.setState({
        temp: {
          ...this.state.temp,
          doorCode: event.target.value
        }
      });
    id === "membership" &&
      this.setState({
        temp: {
          ...this.state.temp,
          accessLevel: event.target.value
        }
      });
    id === "pagesPrinted" &&
    this.setState({
      temp: {
        ...this.state.temp,
        pagesPrinted: 0
      }
    });
  }

  /*
  translating access Level into role
  The access level is defined as follows:
  -2: Ban
  -1: Pending
   0: Member
   1: Officer
   2: Admin
  */
  roleTranslator (level) {
    switch (level) {
      case -2:
        return 'Ban'
      case 0:
        return 'Member'
      case 1:
        return 'Officer'
      case 2:
        return 'Admin'
      default:
        return 'Pending'
    }
  }

  EditModalButton() {

    let FormGroups=[
      {
        label: 'First Name',
        type: 'email',
        name: 'email',
        placeholder:this.state.user.firstName,
        onChange: 'firstName'
      },
      {
        label: 'Last Name',
        type: 'email',
        name: 'email',
        placeholder:this.state.user.lastName,
        onChange: 'lastName'
      },
      {
        label: 'Middle Name',
        type: 'email',
        name: 'email',
        placeholder:this.state.user.middleInitial,
        onChange: 'middleInitial'
      },
      {
        label: 'Email',
        type: 'email',
        name: 'email',
        placeholder:this.state.user.email,
        onChange: 'email'
      },
      {
        label: 'Password',
        type: 'password',
        name: 'password',
        placeholder:'make it secure',
        onChange: 'password'
      },
      {
        label:'Door Code',
        type:'email',
        name:'Doorcode',
        placeholder:'make it secure',
        onChange:'doorCode'
      }
    ]

    /*
    translating access Level into role
    The access level is defined as follows:
    -2: Ban
    -1: Pending
     0: Member
     1: Officer
     2: Admin
    */
    let memberships =[0,1,-1,2,-2]

    return (
      <div>
        <div>
          <Button
            color="primary"
            style={{
              position: 'relative',
              left: '80%'
            }}
            onClick={() => {this.handleToggle()}}>
            Edit
          </Button>
        </div>

        <Modal isOpen={this.state.toggle}>
          <ModalHeader>Modal title</ModalHeader>
          <ModalBody>
            <Form>

            {FormGroups.map((group,index)=>
              {
                return <FormGroup key={index}>
                  <Label>{group.label}</Label>
                  <Input
                    type={group.type}
                    name={group.name}
                    placeholder={group.placeholder}
                    onChange={event => {
                      this.change(event, group.onChange);
                    }}
                  />
                </FormGroup>
              })}

              {/*Need Improvements, not doing anything currently*/}
              <FormGroup>
                <Label for="exampleFile">Upload New Profile Picture</Label>
                <Input
                  type="file"
                  name="file"
                  id="exampleFile"
                  onChange={event => {
                    this.change(event, "profile");
                  }}
                />
                <FormText color="muted">(Not Working!)</FormText>
              </FormGroup>

              <Button
              type = 'button'
              onClick={event => {
                this.change(event, 'pagesPrinted');
              }}
              color="info">
                Reset Pages!
              </Button>

              <FormGroup tag="fieldset">
                <legend>Membership Status</legend>
                {memberships.map((membership,index)=>{
                  return <FormGroup check key={index}>
                    <Label check>
                      <Input
                        type="radio"
                        name="radio1"
                        value={membership}
                        onChange={event => {
                          this.change(event, "membership");
                        }}
                      />
                      {this.roleTranslator(membership)}
                    </Label>
                  </FormGroup>
                })}
              </FormGroup>

            </Form>
          </ModalBody>

          <ModalFooter>
            <Button
              color="primary"
            onClick={()=>{this.handleSubmissionToggle()}}>
              Submit
            </Button>
            <Button
              color="secondary"
              onClick={() => {this.handleToggle()}}>
              Cancel
            </Button>
          </ModalFooter>

        </Modal>
      </div>
    );
  }

  display()
  {
    return <div>
      <Badge color="primary">{this.roleTranslator(this.state.user.accessLevel)}</Badge>
      <h3>
        {this.state.user.firstName[0].toUpperCase() +
          this.state.user.firstName.slice(1, this.state.user.firstName.length) +
          ' ' +
          this.state.user.lastName[0].toUpperCase() +
          this.state.user.lastName.slice(1, this.state.user.lastName.length)}
        {this.state.user.middleInitial.trim() !== '' &&
          ' ' + this.state.user.middleInitial.toUpperCase() + '.'}
      </h3>
      <h5>Doorcode: {this.state.user.doorCode}</h5>
      <h5>Member Since (yyyy-mm-dd): {this.state.user.joinDate.slice(0,10)}</h5>
      <h5>Expiration on (yyyy-mm-dd): {this.state.user.membershipValidUntil.slice(0,10)}</h5>
      <h5>Email: {this.state.user.email}</h5>
      <h5>Major: {this.state.user.major}</h5>
        <h5>Pages Print: {this.state.user.pagesPrinted}/30</h5>
    </div>
  }

  render() {
    return (
      <div>
        <div>
          <div className="center">
            <ul className="profileInfo">
              <Container>
                <img
                alt='profile'
                style={{height:'300px'}}
                src='images/SCE-glow.png' />
              </Container>

              {this.display()}

              <Row>
                <Col>{this.EditModalButton()}</Col>
              </Row>

              <Modal
              style={
                {
                  marginTop:'320px',
                }}
              isOpen={this.state.toggleSubmit}>
                <Button
                  onClick={()=>{this.handleSubmission()}}
                  color="primary">
                  YES! mutate them!
                </Button>
                <Button
                  style={{
                    marginTop:'10px'
                  }}
                  onClick={()=>this.handleSubmissionToggle()}
                  color="danger">
                  Nah! It's a mistake.
                </Button>
              </Modal>

            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default ProfilePage;
