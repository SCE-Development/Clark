import React from 'react';
import './membershipApplication.css';
import { Col, Button, Form, FormGroup, Label, Input, TabContent, TabPane, Nav, NavItem, NavLink, Card, CardTitle, CardText, Row, Modal,ModalHeader , ModalFooter, ModalBody} from 'reactstrap';
import classnames from 'classnames';

export default class MembershipApplication extends React.Component {

    // @ctor
    constructor( props ) {

        // Call parent constructor
        super( props );

        // Set initial state
        this.state = {
            firstName: "",
            middleInitial: "",
            lastName: "",
            email: "",
            username: "",
            password: ""
        };
    }

    // @function        mutateFirstName()
    // @description     This function handles input field changes for
    //                  the aforementioned field
    // @parameters      (event) e       the javascript event passed
    //                                  to this handle when the input
    //                                  changes.
    // @returns         n/a
    mutateFirstName( e ) {

        // Create a copy of the current state
        var tempState = Object.assign( this.state );

        // Set the new state
        tempState.firstName = e.target.value;
        this.setState(tempState);
        // console.log("Firstname:", tempState.firstName);
    }

    // @function        mutateMiddleInitial()
    // @description     This function handles input field changes for
    //                  the aforementioned field
    // @parameters      (event) e       the javascript event passed
    //                                  to this handle when the input
    //                                  changes.
    // @returns         n/a
    mutateMiddleInitial( e ) {

        // Create a copy of the current state
        var tempState = Object.assign( this.state );

        // Set the new state
        tempState.middleInitial = e.target.value;
        this.setState(tempState);
    }
    
    // @function        mutateLastName()
    // @description     This function handles input field changes for
    //                  the aforementioned field
    // @parameters      (event) e       the javascript event passed
    //                                  to this handle when the input
    //                                  changes.
    // @returns         n/a
    mutateLastName( e ) {

        // Create a copy of the current state
        var tempState = Object.assign( this.state );

        // Set the new state
        tempState.lastName = e.target.value;
        this.setState(tempState);
    }
    
    // @function        mutateEmail()
    // @description     This function handles input field changes for
    //                  the aforementioned field
    // @parameters      (event) e       the javascript event passed
    //                                  to this handle when the input
    //                                  changes.
    // @returns         n/a
    mutateEmail( e ) {

        // Create a copy of the current state
        var tempState = Object.assign( this.state );

        // Set the new state
        tempState.email = e.target.value;
        this.setState(tempState);
    }
    
    // @function        mutateUsername()
    // @description     This function handles input field changes for
    //                  the aforementioned field
    // @parameters      (event) e       the javascript event passed
    //                                  to this handle when the input
    //                                  changes.
    // @returns         n/a
    mutateUsername( e ) {

        // Create a copy of the current state
        var tempState = Object.assign( this.state );

        // Set the new state
        tempState.username = e.target.value;
        this.setState(tempState);

        // Check if the username is available by querying the server
        var request = require( 'superagent' );
        request.post('http://localhost:3000/api/user/search')
        .set('Content-Type', 'application/json;charset=utf-8')
        .send( {
            'type': ''  // TODO: Create an API meant solely for checking if a username is available (making it safe for public exposure)
        } )
        .end( function( err, response ){
            
            if( response && response.status < 300 ){

                // Success
                // TODO: Check if a username was found
            } else {
                
                // Failure
                // TODO: Respond with error
            }
        } );
    }
    
    // @function        mutatePassword()
    // @description     This function handles input field changes for
    //                  the aforementioned field
    // @parameters      (event) e       the javascript event passed
    //                                  to this handle when the input
    //                                  changes.
    // @returns         n/a
    mutatePassword( e ) {

        // Create a copy of the current state
        var tempState = Object.assign( this.state );

        // Set the new state
        tempState.password = e.target.value;
        this.setState(tempState);
    }

    // @function        render()
    // @description     This function renders the membership
    //                  application form
    // @parameters      n/a
    // @returns         (jsx) html      The generated html content 
    render() {
        return (
            <div class="membership-application">
                <h1 class="page-title">Member Registration</h1>
                <div class="notice">
                    <span class="critical">*</span><span class="important"> = This is a required field</span>
                </div>
                <Form class="page-form">
                    <h3>General Information</h3>
                    <FormGroup>
                        <Label for="firstName">First Name*</Label>
                        <Input type="text" onChange={this.mutateFirstName.bind(this)} value={this.state.firstName} name="firstName" id="input_firstName" placeholder="(e.g. John)"></Input>
                    </FormGroup>
                    <FormGroup>
                        <Label for="middleInitial">Middle Initial*</Label>
                        <Input type="text" onChange={this.mutateMiddleInitial.bind(this)} value={this.state.middleInitial} name="middleInitial" id="input_middleInitial" placeholder="(e.g. J)"></Input>
                    </FormGroup>
                    <FormGroup>
                        <Label for="lastName">Last Name*</Label>
                        <Input type="text" onChange={this.mutateLastName.bind(this)} value={this.state.lastName} name="lastName" id="input_lastName" placeholder="(e.g. Doe)"></Input>
                    </FormGroup>
                    <FormGroup>
                        <Label for="email">Email*</Label>
                        <Input type="email" onChange={this.mutateEmail.bind(this)} value={this.state.email} name="email" id="input_email" placeholder="example@email.com"></Input>
                    </FormGroup>

                    <h3>Account Configuration</h3>
                    <FormGroup>
                        <Label for="username">Username*</Label>
                        <Input type="text" onChange={this.mutateUsername.bind(this)} value={this.state.username} name="username" id="input_username" placeholder="(e.g. sce_user)"></Input>
                    </FormGroup>
                    <FormGroup>
                        <Label for="password">Password*</Label>
                        <Input type="text" onChange={this.mutatePassword.bind(this)} value={this.state.password} name="password" id="input_password" placeholder="(e.g. sce_password)"></Input>
                    </FormGroup>
                </Form>
            </div>
        );
    }
}