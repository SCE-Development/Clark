import React, { Component } from 'react';
import "./landingPage.css"

import { AvForm, AvGroup, AvInput, AvFeedback,  } from 'availity-reactstrap-validation';
import { Button , Label} from 'reactstrap';

export default class LandingPage extends Component {
    render() { 
        return (
            <div className = "login">
            <AvForm>
                <AvGroup> {/*Group to submit email address*/}
                    <Label for="email">E-mail</Label>
                    <AvInput name="email" id="email"  type = "email"required />
                    
                    <AvFeedback>This field is invalid</AvFeedback>
                </AvGroup>

                <AvGroup>{/*Group to submit password*/}
                    <Label for="password">Password</Label>
                    <AvInput name="password" id="password" type = "password"required />
                    
                    <AvFeedback>This field is invalid</AvFeedback>
                </AvGroup>
            </AvForm>

            <Button color = "primary" onClick = {() => this.handleClick()}>
                login
            </Button>
            <br></br>

            <p>or continue as <i>guest</i></p>
            </div>
        );
    }


      // add arrows to avoid the binding in constructor. arrow functions inherit binding
      handleClick = ({email,password}) => {
        // log that the button has been clicked
        console.log("login button clicked", this.state.email, this.state.password);
        
        if (this.state.email === "" | this.state.password === ""){
            return <h1>"ERROr"</h1>
        }
    }
}
 
