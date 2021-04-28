import React, { Component } from 'react';
import './AboutUs.css';
import AboutUsCard from './AboutUsCard.js';
import AboutUsCircle from './AboutUsCircle.js';
import {getAllOfficers} from '../../APIFunctions/OfficerManager';
import Header from '../../Components/Header/Header';
import Footer from '../../Components/Footer/Footer';
class AboutUs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      officers: [],
    };
    this.headerProps = {
      title: 'About Us'
    };
  }

  componentDidMount(){
    getAllOfficers().then(response => {
      this.setState({
        officers: response.responseData
      });
    });
  }

  render() {
    return (
      <>
        <Header {...this.headerProps} />
        <main className="officer-body">
          <section className="exec-container">
            <h2>Executive Team</h2>
            <div className="grid-container">
              {this.state.officers.length?
                (this.state.officers.map((info, index) => {
                  if (info.team === 'executive'){
                    return(
                      <AboutUsCard info={info} key={index}/>
                    );
                  }
                })):null
              }
            </div>
          </section>
          <section className="officer-container">
            <h2>Meet Our Team</h2>
            <div className="grid-container-circle">
              {this.state.officers.length ?
                (this.state.officers.map((info, index)=> {
                  if (info.team === 'officers'){
                    return(
                      <AboutUsCircle info={info} key={index}/>
                    );
                  }
                })): null
              }
            </div>
          </section>
        </main>
        <Footer/>
      </>
    );
  }
}

export default AboutUs;
