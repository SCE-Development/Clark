import React from 'react'
import Ionicon from 'react-ionicons'
import {
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
  Row,
  Col,
  Media,
  Card,
  CardImg
} from 'reactstrap'
import classnames from 'classnames'
import './App.css'
import './card-config.css'
import Ari from './teamPics/2018_2019/arisKoumis.png'
import Evan from './teamPics/2018_2019/evanUgarte.png'
import Pranav from './teamPics/2018_2019/pranavPatil.png'
import Keven from './teamPics/2018_2019/kevenGallegos.png'
import Alisha from './teamPics/2018_2019/alishaMehndiratta.png'
import Thenu from './teamPics/2018_2019/thenuSenthil.png'
import DRP from './teamPics/2018_2019/DRP.png'
import Lorena from './teamPics/2018_2019/lorenaSilva.png'
import Nick from './teamPics/2018_2019/nickDerry.png'

export default class Example extends React.Component {
  constructor (props) {
    super(props)

    this.toggle = this.toggle.bind(this)
    this.state = {
      activeTab: '1',

      json: [
        {
          name: 'Aris Koumis',
          major: 'B.S Computer Engineering',
          tag: '#ArisKoumis',
          source: Ari,
          facebook: 'https://www.google.com/',
          linkedin: 'https://www.google.com/',
          github: 'https://www.google.com/'
        },
        {
          name: 'Evan Ugarte',
          major: 'B.S Software Engineering',
          tag: '#EvanUgarte',
          source: Evan,
          facebook: 'https://www.google.com/',
          linkedin: 'https://www.google.com/',
          github: 'https://www.google.com/'
        },
        {
          name: 'Pranav Patil',
          major: 'B.S Computer Engineering',
          tag: '#pranavPatil',
          source: Pranav,
          facebook: 'https://www.google.com/',
          linkedin: 'https://www.google.com/',
          github: 'https://www.google.com/'
        },
        {
          name: 'Keven Gallegos',
          major: 'Unknown',
          tag: '#kevenGallegos',
          source: Keven,
          facebook: 'https://www.google.com/',
          linkedin: 'https://www.google.com/',
          github: 'https://www.google.com/'
        },
        {
          name: 'Keven Gallegos',
          major: 'B.S Mechanical Engineering',
          tag: '#DonRobertPornaras',
          source: DRP,
          facebook: 'https://www.google.com/',
          linkedin: 'https://www.google.com/',
          github: 'https://www.google.com/'
        },
        {
          name: 'Thenu Senthil',
          major: 'B.S Computer Engineering',
          tag: '#ThenuSenthil',
          source: Thenu,
          facebook: 'https://www.google.com/',
          linkedin: 'https://www.google.com/',
          github: 'https://www.google.com/'
        },
        {
          name: 'Alisha Mehndiratta',
          major: 'B.S Software Engineering',
          tag: '#AlishaMehndiratta',
          source: Alisha,
          facebook: 'https://www.google.com/',
          linkedin: 'https://www.google.com/',
          github: 'https://www.google.com/'
        },
        {
          name: 'Lorena Silva',
          major: 'B.S Computer Engineering',
          tag: '#LorenaSilva',
          source: Lorena,
          facebook: 'https://www.google.com/',
          linkedin: 'https://www.google.com/',
          github: 'https://www.google.com/'
        },
        {
          name: 'Nick Derry',
          major: 'B.S Computer Engineering',
          tag: '#Nick Derry',
          source: Nick,
          facebook: 'https://www.google.com/',
          linkedin: 'https://www.google.com/',
          github: 'https://www.google.com/'
        },
        {
          name: 'Aris Koumis v1',
          major: 'B.S Computer Engineering',
          tag: '#ArisKoumis',
          source: Ari,
          facebook: 'https://www.google.com/',
          linkedin: 'https://www.google.com/',
          github: 'https://www.google.com/'
        },
        {
          name: 'Aris Koumis v2',
          major: 'B.S Computer Engineering',
          tag: '#ArisKoumis',
          source: Ari,
          facebook: 'https://www.google.com/',
          linkedin: 'https://www.google.com/',
          github: 'https://www.google.com/'
        }
      ]
    }
  }

  toggle (tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      })
    }
  }

  render () {
    function block (target, index) {
      var col
      if (index % 2 === 0) {
        col = 'col1'
      } else {
        col = 'col2'
      }
      return (
        <Col sm='4' id={col}>
          <Card body className='wholeCard'>
            {/* }<svg viewBox="0 0 24 24">
            <path fill="#000000"
             d="M2 17V20H10V18.11H3.9V17C3.9 16.36 7.03 14.9 10 14.9C10.96 14.91 11.91 15.04 12.83 15.28L14.35 13.76C12.95 13.29 11.5 13.03 10 13C7.33 13 2 14.33 2 17M10 4C7.79 4 6 5.79 6 8S7.79 12 10 12 14 10.21 14 8 12.21 4 10 4M10 10C8.9 10 8 9.11 8 8S8.9 6 10 6 12 6.9 12 8 11.11 10 10 10M21.7 13.35L20.7 14.35L18.65 12.35L19.65 11.35C19.86 11.14 20.21 11.14 20.42 11.35L21.7 12.63C21.91 12.84 21.91 13.19 21.7 13.4M12 18.94L18.06 12.88L20.11 14.88L14.11 20.95H12V18.94" />
          </svg> */}
            <Media>
              <Media href={target.tag} className='Pic'>
                <CardImg height='250' width='250' src={target.source} />
              </Media>
              <Media body className='SubTitle'>
                <Media heading className='NameHead'>
                  <h2>{target.name}</h2>
                  <h5>{target.major}</h5>
                </Media>
                <Media className='link'>
                  <a href={target.facebook}>
                    <Ionicon
                      icon='logo-facebook'
                      fontSize='35px'
                      color='#757575'
                    />
                  </a>
                  <a href={target.linkedin}>
                    <Ionicon
                      icon='logo-linkedin'
                      fontSize='35px'
                      color='#757575'
                    />
                  </a>
                  <a href={target.github}>
                    <Ionicon
                      icon='logo-github'
                      fontSize='35px'
                      color='#757575'
                    />
                  </a>
                </Media>
              </Media>
            </Media>
            <Media className='description'>
              Cras sit amet nibh libero, in gravida nulla. Nulla vel metus
              scelerisque ante
            </Media>
          </Card>
        </Col>
      )
    }

    return (
      <div className='Page'>
        {/* -----------------Nav Bar------------------- */}
        <Nav tabs>
          <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === '1' })}
              onClick={() => {
                this.toggle('1')
              }}
            >
              2018 - 2019 Academic Year
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === '2' })}
              onClick={() => {
                this.toggle('2')
              }}
            >
              2019 - 2020 Academic Year
            </NavLink>
          </NavItem>
        </Nav>

        <TabContent activeTab={this.state.activeTab}>
          {/* -----------------Panel 1------------------- */}
          <TabPane tabId='1' id='tab1' className='Panel'>
            <h1 className='Title'>Leadership</h1>

            <Row id='rowCSS'>
              {this.state.json.map((obj, index) => block(obj, index))}
            </Row>

            <h1 className='Title'>Software Development Team</h1>

            <Row id='rowCSS'>
              {this.state.json.map((obj, index) => block(obj, index))}
            </Row>

            <h1 className='Title'>Event Planning and Public Relations Team</h1>

            <Row id='rowCSS'>
              {this.state.json.map((obj, index) => block(obj, index))}
            </Row>

            <h1 className='Title'>Associates</h1>

            <Row id='rowCSS'>
              {this.state.json.map((obj, index) => block(obj, index))}
            </Row>
          </TabPane>

          {/* -----------------Panel 2------------------- */}

          <TabPane tabId='2' id='tab2' className='Panel'>
            <h1 className='Title'>Executive Leadership</h1>

            <Row id='rowCSS'>
              {this.state.json.map((obj, index) => block(obj, index))}
            </Row>

            <h1 className='Title'>Software Development Team</h1>

            <Row id='rowCSS'>
              {this.state.json.map((obj, index) => block(obj, index))}
            </Row>

            <h1 className='Title'>Event Planning and Public Relations Team</h1>

            <Row id='rowCSS'>
              {this.state.json.map((obj, index) => block(obj, index))}
            </Row>

            <h1 className='Title'>Associates</h1>

            <Row id='rowCSS'>
              {this.state.json.map((obj, index) => block(obj, index))}
            </Row>
          </TabPane>
        </TabContent>
      </div>
    )
  }
}
