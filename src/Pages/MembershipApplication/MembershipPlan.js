import React, { Component } from 'react'
import './register-page.css'
import fall from './assets/fall.jpg'
import fall2 from './assets/fall2.jpeg'
import winter from './assets/winter.jpeg'
import winter2 from './assets/winter2.jpeg'
import summer from './assets/summer.jpeg'
import summer2 from './assets/summer2.jpeg'
import spring from './assets/spring.jpg'
import spring2 from './assets/spring2.jpeg'
import { Container, Button, Row } from 'reactstrap'
import { memberApplicationState, membershipPlans } from '../../Enums'
import { getSemesterPlan, getYearPlan } from './GetPlans'

class MembershipPlan extends Component {
  constructor (props) {
    super(props)
    this.state = {
      yearPicture: winter2,
      semesterPicture: winter,
      activeId: undefined,
      planSelected: false,
      year: new Date().getFullYear(),
      planType: []
    }
  }

  cardSelected (plan) {
    if (
      plan.includes('Spring and Fall') ||
      plan.includes('Fall ' + this.state.year + ' and')
    ) {
      this.props.setSelectedPlan(membershipPlans.YEAR)
    } else {
      this.props.setSelectedPlan(membershipPlans.SEMESTER)
    }
    this.setState({
      activeId: plan,
      planSelected: true
    })
  }

  getExpirationDate (plan) {
    if (
      plan.includes('Fall ' + this.state.year) ||
      plan.includes('Spring and Fall ' + this.state.year)
    ) {
      return `May 20th, ${this.state.year}`
    }
    return `December 20th, ${this.state.year}`
  }

  componentDidMount () {
    this.changeSeason()
    this.setState({
      planType: [
        {
          plan: getSemesterPlan(),
          img: this.state.semesterPicture,
          expire: this.getExpirationDate(getSemesterPlan())
        },
        {
          plan: getYearPlan(),
          img: this.state.yearPicture,
          expire: this.getExpirationDate(getYearPlan())
        }
      ]
    })
  }

  changeSeason () {
    const month = new Date().getMonth() + 1
    if (month === 12 || month === 1 || month === 2) {
      this.setState({ semesterPicture: winter, yearPicture: winter2 })
    } else if (month >= 3 && month <= 5) {
      this.setState({ semesterPicture: spring, yearPicture: spring2 })
    } else if (month >= 6 && month <= 8) {
      this.setState({ semesterPicture: summer, yearPicture: summer2 })
    } else {
      this.setState({ semesterPicture: fall, yearPicture: fall2 })
    }
  }

  render () {
    return (
      <Container>
        <h1>Hi! We're glad you're here.</h1>
        <div className='membership'>
          <Row className='membership-plan-row'>
            {this.state.planType.map((type, ind) => (
              <div
                className={
                  type.plan === this.state.activeId
                    ? 'card membership-card active-plan'
                    : 'card membership-card'
                }
                id={type.plan}
                key={ind}
                onClick={this.cardSelected.bind(this, type.plan)}
              >
                <img className='img' alt='card' src={type.img} />
                <div className='card-body'>
                  <h4 style={{ alignSelf: 'left' }}>{type.plan}</h4>
                  <h6 style={{ margin: 5 }}>
                    Access to our club room during legal building hours. Access
                    to our events and news. And much more! This membership lasts
                    a semester and expires on {type.expire}. Sign Up @ SCE (ENGR
                    294)
                  </h6>
                </div>
              </div>
            ))}
          </Row>
        </div>
        <Row className='transition-button-wrapper' id='membership-plan-btn'>
          <Button
            disabled={!this.state.planSelected}
            onClick={() =>
              this.props.setMembershipState(memberApplicationState.FORM_INFO)}
          >
            Add account information
          </Button>
        </Row>
      </Container>
    )
  }
}

export default MembershipPlan
