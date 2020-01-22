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

class MembershipPlan extends Component {
  constructor (props) {
    super(props)
    this.state = {
      img1: winter,
      img2: winter2,
      activeId: undefined,
      planSelected: false,
      yearPlan: '',
      year: new Date().getFullYear(),
      semester: ''
    }
  }

  cardSelected (id) {
    if (
      id === 'Spring and Fall ' + this.state.year ||
      id === 'Fall ' + this.state.year + 'Spring ' + this.state.year++
    ) {
      this.props.setSelectedPlan(membershipPlans.YEAR)
    } else {
      this.props.setSelectedPlan(membershipPlans.SEMESTER)
    }
    this.setState({
      activeId: id,
      planSelected: true
    })
  }

  getBody (title) {
    if (
      title === 'Spring and Fall ' + this.state.year ||
      title === 'Fall ' + this.state.year
    ) {
      return (
        <h6 style={{ margin: 5 }}>
          Access to our club room during legal building hours. Access to our
          events and news. And much more! This membership lasts a full year and
          expires on December 20th, {this.state.year}. Sign Up @ SCE (ENGR 294){' '}
        </h6>
      )
    }
    return (
      <h6 style={{ margin: 5 }}>
        Access to our club room during legal building hours. Access to our
        events and news. And much more! This membership lasts a semester and
        expires on May 20th, {this.state.year}. Sign Up @ SCE (ENGR 294)
      </h6>
    )
  }

  componentDidMount () {
    this.changeSeason()
    this.getSemesterPlan()
    this.getYearPlan()
  }

  getSemesterPlan () {
    const month = new Date().getMonth()

    if (month <= 4) {
      this.setState({ semester: 'Spring ' + this.state.year })
    } else {
      this.setState({ semester: 'Fall ' + this.state.year })
    }
  }

  getYearPlan () {
    const month = new Date().getMonth()

    if (month <= 4) {
      this.setState({ yearPlan: 'Spring and Fall ' + this.state.year })
    } else {
      this.setState({
        yearPlan: 'Fall ' + this.state.year + 'Spring ' + this.state.year
      })
    }
  }

  makeCard (title, img) {
    return (
      <div
        className={
          title === this.state.activeId
            ? 'card membership-card active-plan'
            : 'card membership-card'
        }
        id={title}
        onClick={this.cardSelected.bind(this, title)}
      >
        <img className='img' alt='card' src={img} />
        <div className='card-body'>
          <h4 style={{ alignSelf: 'left' }}>{title}</h4>
          {this.getBody(title)}
        </div>
      </div>
    )
  }

  changeSeason () {
    const month = new Date().getMonth() + 1
    if (month === 12 || month === 1 || month === 2) {
      this.setState({ img1: winter, img2: winter2 })
    } else if (month >= 3 && month <= 5) {
      this.setState({ img1: spring, img2: spring2 })
    } else if (month >= 6 && month <= 8) {
      this.setState({ img1: summer, img2: summer2 })
    } else {
      this.setState({ img1: fall, img2: fall2 })
    }
  }

  render () {
    return (
      <Container>
        <h1>Hi! We're glad you're here.</h1>
        <div className='membership'>
          <Row className='membership-plan-row'>
            {this.makeCard(this.state.semester, this.state.img1)}
            {this.makeCard(this.state.yearPlan, this.state.img2)}
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
