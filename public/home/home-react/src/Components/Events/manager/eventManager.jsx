import React from 'react';
import { Col, Button, Form, FormGroup, Label, Input, TabContent, TabPane, Nav, NavItem, NavLink, Card, CardTitle, CardText, Row, Modal,ModalHeader , ModalFooter, ModalBody} from 'reactstrap';
import classnames from 'classnames';
// import axios from 'axios';
import "../announcements/announcementsPage.css"
import "../announcements/announcementsPage"
import { AvForm, AvGroup, AvInput, AvFeedback,  } from 'availity-reactstrap-validation';

export default class EventManager extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        activeTab: '1',
        modal: false,
        
        status: 'draft',
        eventName: '',
        eventDescription: '',
        eventDate: '',
        eventTime: '',
        eventLocation: '',
        eventHost: '',
        eventContact: '',

        publishedEvents: [],
        draftedEvents: []
      };
    };

    // componentDidMount = () => {
    //   console.log("componentDidMount");
    //   this.loadPublishedEventsFromServer();
    //   this.loadDraftedEventsFromServer();
    // }
  
    // loadPublishedEventsFromServer = () => {
    //   axios.get('http://localhost:5000/api/form?status=published')
    //   .then(res => {
    //     console.log(res.data);

    //     // Load new state
    //     let newState = {...this.state, publishedEvents: res.data.data };
    //     this.setState(newState);
    //     console.log(this.state);
    //   });
    // }

    // loadDraftedEventsFromServer = () => {
    //   axios.get('http://localhost:5000/api/form?status=draft')
    //   .then(res => {
    //     console.log(res.data);

    //     // Load new state
    //     let newState = {...this.state, draftedEvents: res.data.data };
    //     this.setState(newState);
    //     console.log(this.state);
    //   });
    // }
    
    toggle = (tab) => {
      if (this.state.activeTab !== tab) {
        this.setState({
          activeTab: tab
        });
      }
    }

    edit_modal_toggle = () => {
      this.setState({
        modal: !this.state.modal
      });
    }

    onChange_eventName = (e) => {
      this.setState({
        eventName: e.target.value,
      });
    }

    onChange_eventDescription = (e) => {
      this.setState({
        eventDescription: e.target.value,
      });
    } 
    onChange_eventDate= (e) => {
      this.setState({
        eventDate: e.target.value,
      });
    } 
    
    onChange_eventTime = (e) => {
      this.setState({
        eventTime: e.target.value,
      });
    } 

    onChange_eventLocation = (e) => {
      this.setState({
        eventLocation: e.target.value,
      });
    }

    onChange_eventHost = (e) => {
      this.setState({
        eventHost: e.target.value,
      });
    }

    onChange_eventContact = (e) => {
      this.setState({
        eventContact: e.target.value,
      });
    }

    // when user clicks submit in post tab
    onClickPost = (e) => {
      e.preventDefault(); // Prevent reloading page 

      // Store the state of current data into form
      const submitData = {
        status: 'draft',
        eventName: this.state.eventName,
        eventDescription: this.state.eventDescription,
        eventDate: this.state.eventDate,
        eventTime: this.state.eventTime,
        eventLocation: this.state.eventLocation,
        eventHost: this.state.eventHost,
        eventContact: this.state.eventContact,
      }

      // Post to DB with the current state
      // axios.post('http://localhost:5000/api/form', submitData)
      // .then((res) => {
      //   console.log(res.data); // Log data onto console

      //   const form = res.data.data; // Get data from the response
        
      //   // Create a copy of published and drafted arrays and store
      //   // Push it to the top of the page
      //   const newPublished = this.state.publishedEvents.slice();  
      //   newPublished.unshift(form); 

      //   const newDrafts = this.state.draftedEvents.slice();
      //   newDrafts.unshift(form);

      //   this.setState ({   
      //     status: 'draft',     
      //     eventName: '',
      //     eventDescription: '',
      //     eventDate: '',
      //     eventTime: '',
      //     eventLocation: '',
      //     eventHost: '',
      //     eventContact: '',
  
      //     publishedEvents: newPublished,
      //     draftedEvents: newDrafts
      //   });
      // });
    } // End onClickPost

    // when user deletes an event
    onClickDelete = (id) => {
      console.log("onClickDelete: clicked delete with id: "+ id);

      // Post to DB with the current state
      // axios.get('http://localhost:5000/api/form/remove/' + id)
      // .then((result) => {
      //   console.log("Successfully deleted");
      //   console.dir(result.data); // Log data onto console

      //   // Update arrays of drafts and published events
      //   const filteredDrafts = this.state.draftedEvents.filter(form => form._id !== id);
      //   const filteredPublishedEvents = this.state.publishedEvents.filter(form => form._id !== id);
        
      //   // Update state
      //   const newState = {...this.state,publishedEvents: filteredPublishedEvents ,draftedEvents: filteredDrafts};

      //   this.setState(newState);
      // })
      // .catch(err => {
      //   console.log(err);
      // });
    }

    // when user clicks publish in Drafts tab to mark event as "published"
    moveToPublished = (id) => {
      console.log("clicked publish with id: " + id);
      // axios.post('http://localhost:5000/api/form/update/' + id, {status: "published"})
      // .then(result => {
      //   console.log("successfully published:");
      //   console.dir(result.data);
      //   console.dir(this.state.draftedEvents);

      //   const event = result.data.form;
      //   const filteredDrafts = this.state.draftedEvents.filter(form => form._id !== id);
      //   const newState = {...this.state, draftedEvents: filteredDrafts};
      //   newState.publishedEvents.unshift(event);
      //   this.setState(newState);
        
      //   console.dir(this.state.draftedEvents);

      // })
      // .catch (err => {
      //   console.log( err);
      // });
    } // End onClickPublish

    // Switch the tab to the "post" tab
    // Pre-fill the form with the event's present data
    // update

    editEvent = (event) => {
      console.log ("clicked edit button on event: " );
      console.dir(event);

      // Repopulate form
      const new_state = {...this.state,
                          status: event.status,
                          eventName: event.eventName,
                          eventDescription: event.eventDescription,
                          eventDate: event.eventDate,
                           eventTime: event.eventTime,
                           eventLocation: event.eventLocation,
                           eventHost: event.eventHost,
                           eventContact: event.eventContact,

                           publishedEvents: this.state.publishedEvents,
                           draftedEvents: this.state.draftedEvents
                           };
        this.setState(new_state);
          



        console.dir(new_state);
      
    } // End editEvent

    // when user clicks 'move to drafts' in published tab to mark event as "draft"
    moveToDrafts = (id) => {
      console.log("clicked 'move to drafts with id: " + id);
      // axios.post('http://localhost:5000/api/form/update/' + id, {status: "draft"})
      // .then(result => {
      //   console.log("successfully moved:");
      //   console.dir(result.data);

      //   const event = result.data.form;
      //   const filteredPublishedEvents = this.state.publishedEvents.filter(form => form._id !== id);
      //   const newState = {...this.state, publishedEvents: filteredPublishedEvents};
      //   newState.draftedEvents.unshift(event);
      //   this.setState(newState);
      // })
      // .catch (err => {
      //   console.log(err);
      // });
    } // End moveToDrafts

    // Clear form when user hits "clear" in form
    onClickClear = () => {
      this.setState ({   
        status: 'draft',     
        eventName: '',
        eventDescription: '',
        eventDate: '',
        eventTime: '',
        eventLocation: '',
        eventHost: '',
        eventContact: '',

        publishedEvents: [],
        draftedEvents: []
      })
    } // End onClickClear

    render() {
      return (
        <div >
                <Nav className = "NavBar">
                <h1 align = "center">Event Manager Page</h1>
                <NavItem>
                    <NavLink activestyle = {{
                    fontWeight: "bold", 
                    color: "white" 
                    }}
                    >Home
                    </NavLink>
                </NavItem>
                
                <NavItem>
                    <NavLink activestyle = {{
                    fontWeight: "bold", 
                    color: "white" 
                    }}
                    >Event Manager
                    </NavLink> 
                </NavItem>
                </Nav>

          {/*the following will display the tabs*/}
          <Nav tabs>

          <NavItem>
              <NavLink
                className={classnames({ active: this.state.activeTab === '1' })}
                onClick={() => { this.toggle('1'); }}
              >
                Post
              </NavLink>
            </NavItem>

            <NavItem>
              <NavLink
                className={classnames({ active: this.state.activeTab === '2' })}
                onClick={() => { this.toggle('2'); }}
              >
                Drafts
              </NavLink>
            </NavItem>
            
            <NavItem>
              <NavLink
                className={classnames({ active: this.state.activeTab === '3' })}
                onClick={() => { this.toggle('3'); }}
              >
                Published
              </NavLink>
            </NavItem>
          </Nav>

          {/*The following will handle what happens when we click it*/}
          <TabContent activeTab={this.state.activeTab}>

            {/*Will POST new events through a form*/}
            <TabPane tabId="1" style = {{paddingLeft: 100}} className = "form">
              <Row>
                <Col sm="10">
                  <h4 align = "center" style = {{paddingTop: 5}}>Post New announcements</h4> <br></br>
                  <Form>
                  <FormGroup row>
                    <Label for="EventName" sm={2} >Event Name</Label>
                    <Col sm={10}>
                      <Input type="text" value={this.eventName} onChange={this.onChange_eventName}name="EventName" id="EventName" placeholder="enter event name" required/>
                      {/* <AvFeedback>this is invalid</AvFeedback> */}
                    </Col>
                  </FormGroup>
                   
                  <FormGroup row>
                    <Label for="EventDescription" sm={2}>Event Description</Label>
                    <Col sm={10}>
                      <Input type="textarea" value={this.state.eventDescription} onChange={this.onChange_eventDescription} name="text" id="EventDescription" placeholder="enter event description"/>
                    </Col>
                  </FormGroup>
                  
                  <FormGroup row>
                    <Label for="EventDate" sm={2}>Event Date</Label>
                    <Col sm={10}>
                    <Input type="date" value={this.state.eventDate} onChange={this.onChange_eventDate} name="date" id="EventDate" />
                    </Col>
                  </FormGroup>

                  <FormGroup row>
                    <Label for="EventTime" sm={2}>Time</Label>
                    <Col sm={10}>
                    <Input type="time" value={this.state.eventTime} onChange={this.onChange_eventTime} name="time" id="EventTime" />
                    </Col>
                  </FormGroup>

                  <FormGroup row>
                    <Label for="EventLocation" sm={2}>Event Location</Label>
                    <Col sm={10}>
                    <Input type="text" value={this.state.eventLocation} onChange={this.onChange_eventLocation} name="text" id="EventLocation" placeholder="123 xyz street" />
                    </Col>
                  </FormGroup>

                  <FormGroup row>
                    <Label for="EventHost" sm={2}>Host?</Label>
                    <Col sm={10}>
                      <Input type="text" value={this.state.eventHost} onChange={this.onChange_eventHost} name="EventHost" id="EventHost" placeholder="John Doe" />
                    </Col>
                  </FormGroup>

                  <FormGroup row>
                    <Label for="EventContactInfo" sm={2}>Host Email</Label>
                    <Col sm={10}>
                      <Input type="email" value={this.state.eventContact} onChange={this.onChange_eventContact} name="EventContactInfo" id="EventContactInfo" placeholder="JohnDoe@sjsu.edu" />
                      
                      <Col sm = {100} style = {{paddingTop:15}}>
                      <Button color = "primary" onClick={this.onClickPost}block> Post to Drafts</Button>
                      <Button color = "danger" onClick={this.onClickClear}block> Clear </Button>
                      </Col>
                    </Col>
                  </FormGroup>
                  </Form>                
                  </Col>
              </Row>
            </TabPane>
          
            {/*Will show DRAFTS which will have list of events
                        saved but not published.
                        Each events panel will have buttons to publish or 
                        edit*/}
            <TabPane tabId="2" >
                <Col sm="12" style = {{paddingTop: 10}}> 
                    {this.state.draftedEvents.map( (event) => (
                      <Card body className="text-center" key={event._id}>
                        <CardTitle>{event.eventName}</CardTitle>
                        <CardText>{event.eventDescription}</CardText>
                         
                          <div className = "button_center">
                            <Button color="primary" onClick = {()=>this.moveToPublished(event._id)}>Move to Published events</Button> {' '}
                            <Button color="secondary" onClick = {() => this.edit_modal_toggle()}>Edit</Button> {' '}
                                  <div className="modal">
                                  <Modal isOpen={this.state.modal} toggle={this.edit_modal_toggle}>
                                    <ModalHeader toggle={this.edit_modal_toggle}>Edit your event</ModalHeader>
                                    <ModalBody>
                                       <div>
                                         </div>
                                    </ModalBody>
                                    <ModalFooter>
                                      <Button color="primary" onClick={this.edit_modal_toggle}>Save Changes</Button>{' '}
                                    </ModalFooter>
                                  </Modal>
                                  </div>
                            <Button color="danger" onClick = {()=>this.onClickDelete(event._id)}>Delete</Button>
                          </div>
                      </Card>
                    ))}
                </Col>
            </TabPane>

            {/*Will show PUBLISHED events i.e. events shown on announcements page*/}
            <TabPane tabId="3">
            <Col sm="12" style = {{paddingTop: 10}}>
              {this.state.publishedEvents.map( (event) => ( 
                <Card body className="text-center" key={event._id}>
                  <CardTitle>{event.eventName}</CardTitle>
                  <CardText>{event.eventDescription}</CardText>

                  <div className = "button_center">
                    <Button color="primary" onClick = {()=>this.moveToDrafts(event._id)}>Move to Drafts</Button> {' '}
                    <Button color="secondary">Edit</Button> {' '}
                    <Button color="danger" onClick = {()=>this.onClickDelete(event._id)}>Delete</Button>
                  </div>
                </Card>
            ))}
            </Col>
            </TabPane>
          </TabContent>
        </div>
      );
    }
  }