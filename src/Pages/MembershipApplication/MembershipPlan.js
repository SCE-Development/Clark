import React, { Component } from 'react';
import './MembershipPlan.css';
import fall from './assets/fall.jpg';
import fall2 from './assets/fall2.jpeg';
import winter from './assets/winter.jpeg';
import winter2 from './assets/winter2.jpeg';
import summer from './assets/summer.jpeg';
import summer2 from './assets/summer2.jpeg';
import spring from './assets/spring.jpg';
import spring2 from './assets/spring2.jpeg';
import { Container, Button, Row, Col } from 'reactstrap';
import { memberApplicationState, membershipPlans } from '../../Enums';
import { getSemesterPlan, getYearPlan } from './GetPlans';
import * as countTime from '../../userTimeTraffic.js';

class MembershipPlan extends Component {
  constructor(props) {
    super(props);
    this.state = {
      yearPicture: winter2,
      semesterPicture: winter,
      activeId: undefined,
      planSelected: false,
      year: new Date().getFullYear(),
      planType: [],
      blocks: [
        {
          className: 'how-to-join-block',
          title: 'HOW TO JOIN',
          details: [
            '1️⃣ SELECT a plan below',
            '2️⃣ CLICK on "Add Account Information"',
            '3️⃣ Sign Up @ SCE (ENGR 294)'
          ],
        },
        {
          className: 'why-join-block',
          title: 'WHY JOIN',
          details: [
            '🌱 Free Paper Printing 🖨️ Free 3D Printing',
            '🏢 Company Tours 💯 Access to Workshops',
            '👕 Free Club T-Shirt 🏠 Free Door Code',
            'Club Bonding Events: Potlucks, Game Nights'
          ],
        }
      ],

    };
  }

  cardSelected(plan) {
    if (
      plan.includes('Spring and Fall') ||
      plan.includes('Fall ' + this.state.year + ' and')
    ) {
      this.props.setSelectedPlan(membershipPlans.YEAR);
    } else {
      this.props.setSelectedPlan(membershipPlans.SEMESTER);
    }
    this.setState({
      activeId: plan,
      planSelected: true
    });
  }

  getExpirationDate(plan) {
    if (
      plan.includes('Fall ' + this.state.year) ||
      plan.includes('Spring and Fall ' + this.state.year)
    ) {
      return `Dec. 20th, ${this.state.year}`;
    }
    return `May 20th, ${this.state.year}`;
  }

  componentDidMount() {
    window.addEventListener('onload', countTime.onLoad);
    document.addEventListener('visibilitychange', countTime.visibilityChange);
    this.changeSeason();
    this.setState({
      planType: [
        {
          plan: getSemesterPlan(),
          header: 'SEMESTER PLAN',
          img: this.state.semesterPicture,
          expire: this.getExpirationDate(getSemesterPlan()),
          price: '💵$20'
        },
        {
          plan: getYearPlan(),
          header: 'ANNUAL PLAN',
          img: this.state.yearPicture,
          expire: this.getExpirationDate(getYearPlan()),
          price: '💵$30'
        }
      ]
    });
  }

  componentWillUnmount() {
    window.removeEventListener('onload', countTime.onLoad);
    document.removeEventListener('visibilitychange',
      countTime.visibilityChange);
  }

  changeSeason() {
    const month = new Date().getMonth() + 1;
    if (month === 12 || month === 1 || month === 2) {
      this.setState({ semesterPicture: winter, yearPicture: winter2 });
    } else if (month >= 3 && month <= 5) {
      this.setState({ semesterPicture: spring, yearPicture: spring2 });
    } else if (month >= 6 && month <= 8) {
      this.setState({ semesterPicture: summer, yearPicture: summer2 });
    } else {
      this.setState({ semesterPicture: fall, yearPicture: fall2 });
    }
  }

  render() {
    return (
      <div className='background'>
        <Container id='container-membership-plan'>
          <h1 className='greet'>Welcome</h1>
          <div className='card'>
            <div className='membership'>
              <Container className='top-chunk'>
                <Row className='benefit-block grid'>
                  {this.state.blocks.map((type, ind) => (
                    <div key={ind} className={type.className}>
                      {type.title}
                      {type.details.map((text, index) =>
                        (<p className='deets' key={index}>{text}</p>))}
                    </div>
                  ))
                  }
                </Row>
              </Container>
              <Row className='membership-plan-row'>
                {this.state.planType.map((type, ind) => (
                  <div
                    className={
                      type.plan === this.state.activeId
                        ? 'membership-card active-plan'
                        : 'membership-card'
                    }
                    id={type.plan}
                    key={ind}
                    onClick={this.cardSelected.bind(this, type.plan)}
                  >
                    <Col className='membership-heading'>{type.header}</Col>
                    <h3 className='membership-price'>{type.price}
                      <p className='expiration'>*Expires on {type.expire}.</p>
                    </h3>
                  </div>
                ))}
              </Row>
              <Row
                className='transition-button-wrapper'
                id='membership-plan-btn'
              >
                <Button className='add-acc' style={{ marginBottom: '30px' }}
                  disabled={!this.state.planSelected}
                  onClick={() =>
                    this.props
                      .setMembershipState(memberApplicationState.FORM_INFO)
                  }
                >
                  Add Account Information
                </Button>
              </Row>
            </div>
          </div>
        </Container>
      </div>
    );
  }
}

export default MembershipPlan;
