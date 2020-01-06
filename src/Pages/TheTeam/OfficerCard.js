import React from 'react'
import Ionicon from 'react-ionicons'
import { Col, Media, Card, CardImg, Row, Container } from 'reactstrap'
// import Slideshow from '../../Components/Slideshow/Slideshow'

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
// function Test() {
//     if (socialMedia.icon == 'logo-facebook') {
//         <a href={props.target.facebook} />
//     } else if (socialMedia.icon == 'logo-linkedin') {
//         <a href={props.target.linkedin} />
//     } else if (socialMedia.icon == 'logo-github') {
//         <a href={props.target.github} />
//     }else{
//         <a href={' '} />
//     }
// }

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
        <Card body className='wholeCard'>
          <Media>
            <Media href={props.target.tag} className='Pic'>
              <CardImg height='250' width='250' src={props.target.source} />
            </Media>
            <Media body className='SubTitle'>
              <Container>
                <Media heading className='NameHead'>
                  <h2>{props.target.name}</h2>
                  <h5>{props.target.major}</h5>
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
                </Media>
              </Container>
            </Media>
          </Media>
          <Media className='description'>
            Cras sit amet nibh libero, in gravida nulla. Nulla vel metus
            scelerisque ante
          </Media>
        </Card>
      </Col>
    </>
  )
}
export default OfficerCard

//   export default OfficerCard

//   import React, { useState } from 'react'
//   import Ionicon from 'react-ionicons'
//   import {
//     TabContent,
//     TabPane,
//     Row,
//     Col,
//     Media,
//     Card,
//     CardImg
//   } from 'reactstrap'

//   function OfficerCard(props) {
//       var col
//       if (props.index % 2 === 0) {
//         col = 'col1'
//       } else {
//         col = 'col2'
//       }
//       return (
//         <Col sm='4' id={col}>
//           <Card body className='wholeCard'>
//             <Media>
//               <Media href={props.target.tag} className='Pic'>
//                 <CardImg height='250' width='250' src={props.target.source} />
//               </Media>
//               <Media body className='SubTitle'>
//                 <Media heading className='NameHead'>
//                   <h2>{props.target.name}</h2>
//                   <h5>{props.target.major}</h5>
//                 </Media>
//                 <Media className='link'>
//                   <a href={props.target.facebook}>
//                     <Ionicon
//                       icon='logo-facebook'
//                       fontSize='35px'
//                       color='#757575'
//                     />
//                   </a>
//                   <a href={props.target.linkedin}>
//                     <Ionicon
//                       icon='logo-linkedin'
//                       fontSize='35px'
//                       color='#757575'
//                     />
//                   </a>
//                   <a href={props.target.github}>
//                     <Ionicon
//                       icon='logo-github'
//                       fontSize='35px'
//                       color='#757575'
//                     />
//                   </a>
//                 </Media>
//               </Media>
//             </Media>
//             <Media className='description'>
//               Cras sit amet nibh libero, in gravida nulla. Nulla vel metus
//               scelerisque ante
//                     </Media>
//           </Card>
//         </Col>
//       )
//     }

//     export default OfficerCard
