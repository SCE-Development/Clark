import React, { Component } from 'react'
import './MembershipPlan.css'
import fall from './assets/fall.jpg'
import fall2 from './assets/fall2.jpeg'
import winter from './assets/winter.jpeg'
import winter2 from './assets/winter2.jpeg'
import summer from './assets/summer.jpeg'
import summer2 from './assets/summer2.jpeg'
import spring from './assets/spring.jpg'
import spring2 from './assets/spring2.jpeg'
class MembershipPlan extends Component {
  constructor (props) {
    super(props)
    this.state = {
      img1: winter,
      img2: winter2
    }
  }

  cardSelected (id) {
    if (id === 'Fall 2019') {
      document.getElementById(id).style.backgroundColor = 'rgb(188, 255, 186)'
      document.getElementById('Full Year (2019-2020)').style.backgroundColor =
        ''
    } else {
      document.getElementById(id).style.backgroundColor = 'rgb(188, 255, 186)'
      document.getElementById('Fall 2019').style.backgroundColor = ''
    }
  }

  getBody (title) {
    if (title === 'Full Year (2019-2020)') {
      return (
        <h6 style={{ margin: 5 }}>
          Access to our club room during legal building hours. Access to our
          events and news. And much more! This membership lasts a full year and
          expires on May 20th, 2020. Sign Up @ SCE (ENGR 294){' '}
        </h6>
      )
    }
    return (
      <h6 style={{ margin: 5 }}>
        Access to our club room during legal building hours. Access to our
        events and news. And much more! This membership lasts a semester and
        expires on December 2nd, 2019. Sign Up @ SCE (ENGR 294)
      </h6>
    )
  }

  componentDidMount () {
    this.changeSeason()
  }

  makeCard (title, img) {
    return (
      <div
        className='card'
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
    var month = new Date().getMonth() + 1

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
      <div className='membership'>
        <div className='row'>
          {this.makeCard('Fall 2019', this.state.img1)}
          {this.makeCard('Full Year (2019-2020)', this.state.img2)}
        </div>
      </div>
    )
  }
}

export default MembershipPlan
