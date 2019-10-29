import React, { useState } from "react";
import {
    Container,
    Row,
    Col,
    Card,
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter
} from "reactstrap";

import "./announcementPage.css"



const AnnouncementList = () => {

    let state = {
        // currentEvent: null,
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
                title: "Big brain time",
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

    const [modal, setModal] = useState(false);
    // getModal = () => {
    //     console.log("we in this");
    //     return <Modal name="habib" open={true} />;
    // }
    const [currentEvent, setEvent] = useState();
    const toggle = () => {
        setModal(!modal)
    }

    // console.log(event.description.substring(0,19))
    return (
        <Container>
            {currentEvent == null ? <p /> :
                <Modal isOpen={modal} toggle={toggle}>
                    <ModalHeader toggle={toggle}>{currentEvent.title}</ModalHeader>
                    <ModalBody>
                        {currentEvent.description}
                    </ModalBody>
                    <ModalFooter>
                        Date: {currentEvent.date} {" "}
                        Location: {currentEvent.location} {" "}
                        Time: {currentEvent.time}{" "}

                        <Button color="primary" onClick={toggle}>Close</Button>
                    </ModalFooter>
                </Modal>
            }
            {
                state.events.map((event, index) => {
                    return (

                        <div key={index} onClick={() => {
                            console.log(event.title)
                            setEvent(event)
                            toggle()
                        }} >

                            <Card className="cards">

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
                                            "..." : event.description}
                                    </Col>

                                </Row>
                                <Row>
                                    <Col>
                                        <b>Date:</b> {event.date}

                                    </Col>
                                    <Col xd="1">
                                        <b>Location:</b> {event.location}
                                    </Col>
                                    <Col>
                                        <b>Time:</b> {event.time}
                                    </Col>
                                </Row>
                            </Card>
                        </div>
                    );
                })
            }
        </Container>
    );
}


export default AnnouncementList;
