import React, { Component } from 'react'
import Ionicon from 'react-ionicons'
import { Media, Card, CardImg } from 'reactstrap'

class TeamCard extends Component {
  state = {
    icons: ['facebook', 'linkedin', 'github']
  }

  render () {
    return (
      <Card body className='wholeCard'>
        <Media>
          <Media href='#pranavPatil' className='Pic'>
            <CardImg height='250' width='250' src={this.props.pic} />
          </Media>
          <Media body className='SubTitle'>
            <Media heading className='NameHead'>
              <h2>{this.props.name}</h2>
              <h5>{this.props.major}</h5>
            </Media>
            <Media className='link'>
              {this.state.icons.map((icon, index) => {
                return (
                  <Ionicon
                    key={index}
                    icon={`logo-${icon}`}
                    fontSize='35px'
                    color='#757575'
                  />
                )
              })}
            </Media>
          </Media>
        </Media>
        <Media className='description'>
          Cras sit amet nibh libero, in gravida nulla. Nulla vel metus
          scelerisque ante sollicitudin commodo. Cras purus odio, vestibulum in
          vulputate at, tempus viverra turpis. Fusce condimentum nunc ac nisi
          vulputate fringilla. Donec lacinia congue felis in faucibus.
        </Media>
      </Card>
    )
  }
}

export default TeamCard
