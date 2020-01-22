import React from 'react'
import Ionicon from 'react-ionicons'
import { Media, CardImg, Row, Container } from 'reactstrap'

const socialMedia = [
  {
    icon: 'logo-facebook',
    fontSize: '45px',
    color: '#757575'
  },
  {
    icon: 'logo-linkedin',
    fontSize: '45px',
    color: '#757575'
  },
  {
    icon: 'logo-github',
    fontSize: '45px',
    color: '#757575'
  }
]

function OfficerCard (props) {
  return (
    <>
      <div className='card-container'>
        <Media>
          <Media className='Pic'>
            <CardImg
              className='officer-picture'
              height='250'
              width='250'
              src={props.source}
            />
          </Media>
          <Media body className='SubTitle'>
            <Container>
              <h2 className='name-title'>{props.name}</h2>
              <h5 className='major-title'>{props.major}</h5>
              <Row className='icon-row'>
                {socialMedia.map((item, num) => {
                  return (
                    <Media key={num} className='link'>
                      <Ionicon
                        icon={item.icon}
                        fontSize={item.fontSize}
                        color={item.color}
                      />
                    </Media>
                  )
                })}
              </Row>
            </Container>
          </Media>
        </Media>
        <Media id='quote'>{props.quote}</Media>
      </div>
    </>
  )
}
export default OfficerCard
