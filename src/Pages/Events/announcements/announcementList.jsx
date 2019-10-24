import React from "react";
import {
    Container,
    Row,
    Col,
    Card
} from "reactstrap";
// import EventModal from "./eventModal"
import "./announcementPage.css"

class AnnouncementList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            events: [
                {
                    title: "Git Tutorial",
                    location: "ENG 292",
                    description: "boom",
                    date: "09/03/1999",
                    time: "4:30 PM"

                },
                {
                    title: "ROS MASTERS UNITED",
                    location: "ENG 294",
                    description: "boom",
                    date: "09/03/1999",
                    time: "4:30 PM"

                },
                {
                    title: "Machine Learning Tutorial",
                    location: "ENG 292",
                    description: "boom",
                    date: "09/03/1999",
                    time: "4:30 PM"

                },
                {
                    title: "Burn down the entire school",
                    location: "hahaha",
                    description: "boom asdjfhakjsdfhlkasdhfkajhsdlfkjhaskldjfh" 
                    + "jshdflkjahslkdfjhalk",
                    date: "09/03/1999",
                    time: "4:30 PM"

                },
                {
                    title: "china tour && die forever",
                    location: "Dubai",
                    description: "boom",
                    date: "09/03/1999",
                    time: "4:30 PM"


                },

            ]
        }
    }
    getModal = () => {
        return this.getModal;
    }
    render() {
        // console.log(event.description.substring(0,19))
        return (
            <Container>
                {this.state.events.map((event) => {
                    return (
                        
                            
                            <Card className="lordie"> 
                            {/* onClick={() => {
                                console.log("go to hell")
                            }} */}
                                <Row>
                                    <Col>
                                        <h1>{event.title}</h1>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                
                                        <b>Description:</b> 
                                        {event.description.length > 60 ? 
                                        event.description.substring(0, 59) + 
                                        "..." : event.description }
                                    </Col>
                                    
                                </Row>
                                <Row>
                                    <Col>
                                        <b>Date:</b> {event.date}
    
                                    </Col>
                                    <Col xd = "1">
                                        <b>Location:</b> {event.location}
                                    </Col>
                                    <Col>
                                        <b>Time:</b> {event.time}
                                    </Col>
                                </Row>
                            </Card>
                        
                    );
                })
                }
            </Container>
        );
    }
}

export default AnnouncementList;
