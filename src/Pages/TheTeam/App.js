import React from 'react'
import { TabContent, TabPane, Nav, NavItem, NavLink, Row } from 'reactstrap'
import classnames from 'classnames'
import './App.css'
import './card-config.css'
import Ari from './teamPics/2018_2019/arisKoumis.png'
import Evan from './teamPics/2018_2019/evanUgarte.png'
import Alisha from './teamPics/2018_2019/alishaMehndiratta.png'
import Thenu from './teamPics/2018_2019/thenuSenthil.png'
import Nick from './teamPics/2018_2019/nickDerry.png'
import Layout from '../../Components/Layout/Layout'
import TeamCard from './TeamCard'

export default class Example extends React.Component {
  constructor (props) {
    super(props)

    this.toggle = this.toggle.bind(this)
    this.state = {
      activeTab: '1',
      people: [
        { name: 'Evan Ugarte', major: 'B.S. Software Engineering', pic: Evan },
        { name: 'Seema Vora', major: 'B.S. Computer Engineering', pic: Alisha },
        {
          name: 'Nanar Boursalian',
          major: 'B.S. Software Engineering',
          pic: Thenu
        },
        {
          name: 'Surabhi Gupta,',
          major: 'B.S. Software Engineering',
          pic: Ari
        },
        {
          name: 'Andrew Emerson',
          major: 'B.S. Computer Engineering',
          pic: Nick
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
    return (
      <Layout>
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
                2017 - 2018 Academic Year
              </NavLink>
            </NavItem>
          </Nav>

          <TabContent activeTab={this.state.activeTab}>
            {/* -----------------Panel 1------------------- */}
            <TabPane tabId='1' id='tab1' className='Panel'>
              <h1 className='Title'>Leadership</h1>

              <Row id='rowCSS'>
                {this.state.people.map((person, index) => {
                  return (
                    <TeamCard
                      key={index}
                      name={person.name}
                      major={person.major}
                      pic={person.pic}
                    />
                  )
                })}
              </Row>
            </TabPane>
          </TabContent>
        </div>
      </Layout>
    )
  }
}
