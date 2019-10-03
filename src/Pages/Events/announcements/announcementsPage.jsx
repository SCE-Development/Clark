import React from 'react'
import { Card, CardTitle, Col, CardText } from 'reactstrap'
// import axios from 'axios';
// import NavBarTop from "./navBarTop.jsx";
import Layout from '../../../Components/Layout/Layout'

export default class AnnouncementsPage extends React.Component {
  constructor (props) {
    super(props)
    console.log('Constructor props:')
    console.dir(props)
    console.log('Local storage:')
    console.dir(window.localStorage)

    this.state = {
      publishedEvents: [
        {
          eventName: 'SJSU Eng conference1',
          eventDescription: 'blah',
          eventDate: '10/10/10',
          eventTime: '10pm',
          eventLocation: 'SJSU',
          eventHost: 'Hashim',
          eventContact: 'you'
        },
        {
          eventName: 'SJSU Eng conference2',
          eventDescription: 'blah',
          eventDate: '10/10/10',
          eventTime: '10pm',
          eventLocation: 'SJSU',
          eventHost: 'Hashim',
          eventContact: 'you'
        }
      ]
    }
  };

  /// ////////////////////////////////////////////
  // componentDidMount ->
  // Loads all events upon component load
  /// ////////////////////////////////////////////
  // componentDidMount = () => {
  //   console.log("componentDidMount");
  //   console.dir(this.state);
  //   this.loadPublishedEventsFromServer();

  //   console.dir(this.state);
  // }

  /// ////////////////////////////////////////////
  // componentDidUpdate
  /// ////////////////////////////////////////////
  // componentDidUpdate = () => {
  //   console.log("componentDidUpdate");
  //   console.dir(this.state);
  // }

  /// ////////////////////////////////////////////////////////////
  // loadPublishedEventsFromServer ->
  // Loads all published events from  DB into the "published" tab
  /// ////////////////////////////////////////////////////////////
  // loadPublishedEventsFromServer = () => {
  //   axios.get('http://localhost:5000/api/form/public?status=published')
  //   .then(res => {
  //     //console.log(res.data);
  //     if (res.data.status == false) {
  //       // do nothing
  //       // or show an alert to the user
  //       console.log("in err");
  //       return;
  //     }
  //     // Load new state
  //     let newState = {...this.state, publishedEvents: res.data.data };
  //     this.setState(newState);
  //     console.log("res.data");
  //     console.dir(res.data);
  //     //console.log(this.state);
  //   });
  // }

  render () {
    return (
      <Layout>
        <div className='announcements'>
          {/* <NavBarTop /> */}

          {/* Cards will display the events shown */}
          {/* <Card body className="text-center" key={event._id}>
                      <CardTitle>{event.eventName}</CardTitle>
                      <CardText>{event.eventDescription}</CardText> */}
          <Col sm='12' style={{ paddingTop: 10 }}>
            {this.state.publishedEvents.map((event, index) => (
              <Card body className='text-center' key={index}>

                <CardTitle>{event.eventName}</CardTitle>
                <CardText>{event.eventDescription}</CardText>
                <CardText>{event.eventDate}</CardText>
                <CardText>{event.eventTime}</CardText>
                <CardText>{event.eventLocation}</CardText>
                <CardText>{event.eventHost}</CardText>
                <CardText>{event.eventContact}</CardText>

              </Card>
            ))}
          </Col>
        </div>
      </Layout>
    )
  }
}
