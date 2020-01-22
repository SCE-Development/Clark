import React from 'react'
import { TabContent } from 'reactstrap'

import './the-team.css'
import './card-config.css'
import Evan from './teamPics/2018_2019/evanUgarte.png'
import OfficerCard from './OfficerCard'

export default class TheTeam extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      activeTab: '1',

      json: [
        {
          name: 'Aris Koumis',
          major: 'B.S Computer Engineering',
          role: 'President',
          source: Evan,
          facebook: 'https://www.google.com/',
          linkedin: 'https://www.google.com/',
          github: 'https://www.google.com/',
          quote:
            'sdsf jvkdjsf jvsdv sdjvi kcvmsms ijsdojvs vmvlsjcmc  sijois vjosjc jowecj'
        },
        {
          name: 'Evan Ugarte',
          major: 'B.S Software Engineering',
          role: 'Dev Chair',
          source: Evan,
          facebook: 'https://www.google.com/',
          linkedin: 'https://www.google.com/',
          github: 'https://www.google.com/',
          quote: 'vs vmvlsjcmc  sijois vjosjc jowecj'
        },
        {
          name: 'Pranav Patil',
          major: 'B.S Computer Engineering',
          role: 'Dev',
          source: Evan,
          facebook: 'https://www.google.com/',
          linkedin: 'https://www.google.com/',
          github: 'https://www.google.com/',
          quote: ''
        }
      ]
    }
  }

  render () {
    return (
      <>
        <TabContent activeTab={this.state.activeTab}>
          <h1 className='officer-title'>Leadership</h1>

          <div className='card-list'>
            {this.state.json
              .filter(
                obj =>
                  obj.role.includes('President') || obj.role.includes('Chair')
              )
              .map((obj, index) => (
                <OfficerCard key={index} {...obj} index={index} />
              ))}
          </div>

          <h1 className='officer-title'>Officers</h1>

          <div className='card-list'>
            {this.state.json
              .filter(
                obj =>
                  !obj.role.includes('President') && !obj.role.includes('Chair')
              )
              .map((obj, index) => (
                <OfficerCard key={index} {...obj} index={index} />
              ))}
          </div>
        </TabContent>
      </>
    )
  }
}
