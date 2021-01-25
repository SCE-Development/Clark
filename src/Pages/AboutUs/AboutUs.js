import React, { Component } from 'react';
import './AboutUs.css';
import AboutUsCard from './AboutUsCard.js';
import AboutUsCircle from './AboutUsCircle.js';
import {getAllOfficers} from '../../APIFunctions/OfficerManager';
import Header from '../../Components/Header/Header';

class AboutUs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      officers: [],
      headerProps: {
        title: 'About Us'
      }
    };
  }

  componentDidMount(){
    const token = '';
    getAllOfficers(token).then(response => {
      this.setState({
        officers: response.responseData
      });
    });
  }

  render() {
    return (
      <body className="officer-body">
        <Header {...this.state.headerProps} />
        <section className="exec-container">
          <h1>Executive Team</h1>
          <div className="grid-container">
            {
              this.state.officers.map(info => {
                if(info.team === 'executive'){
                  return(
                    <AboutUsCard info={info}/>
                  );
                }
                return null;
              })
            }
          </div>
        </section>
        <section className="officer-container">
          <h1>Meet Our Team</h1>
          <div className="grid-container-circle">
            {
              this.state.officers.map(info => {
                if(info.team === 'officers'){
                  return(
                    <AboutUsCircle info={info}/>
                  );
                }
                return null;
              })
            }
          </div>
        </section>
      </body>
    );
  }
}

export default AboutUs;
