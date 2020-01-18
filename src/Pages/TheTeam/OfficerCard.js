import React from 'react'
import Ionicon from 'react-ionicons'
import { Col, Media, CardImg, Row, Container } from 'reactstrap'

const socialMedia = [
  {
    icon: 'logo-facebook',
    fontSize: '35px',
    color: '#757575'
  },
  {
    icon: 'logo-linkedin',
    fontSize: '35px',
    color: '#757575'
  },
  {
    icon: 'logo-github',
    fontSize: '35px',
    color: '#757575'
  }
]

function OfficerCard (props) {
  var col
  if (props.index % 2 === 0) {
    col = 'col1'
  } else {
    col = 'col2'
  }
  return (
    <>
      <Col sm='4' id={col}>
        <div className='wholeCard card-body'>
          <Media>
            <Media href={props.tag} className='Pic'>
              <CardImg
                className='officer-picture d-none d-xl-block'
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
          <Media className='description d-none d-xl-block'>
            Cras sit amet nibh libero, in gravida nulla. Nulla vel metus
            scelerisque ante
          </Media>
        </div>
      </Col>
    </>
  )
}
export default OfficerCard
