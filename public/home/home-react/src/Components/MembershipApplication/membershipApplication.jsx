import React from 'react';
import { Col, Button, Form, FormGroup, Label, Input, TabContent, TabPane, Nav, NavItem, NavLink, Card, CardTitle, CardText, Row, Modal,ModalHeader , ModalFooter, ModalBody} from 'reactstrap';
import classnames from 'classnames';

export default class MembershipApplication extends React.Component {

    // @ctor
    constructor( props ) {

        // Call parent constructor
        super( props );

        // Set initial state
        this.state = {};
    }

    // @function        render()
    // @description     This function renders the membership
    //                  application form
    // @parameters      n/a
    // @returns         (jsx) html      The generated html content 
    render() {
        return (
            <div>
                <h1>Testing</h1>
            </div>
        );
    }
}