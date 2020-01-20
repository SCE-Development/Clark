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
          tag: '#ArisKoumis',
          source: Evan,
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
          source: Evan,
          facebook: 'https://www.google.com/',
          linkedin: 'https://www.google.com/',
          github: 'https://www.google.com/'
        },
        {
          name: 'Keven Gallegos',
          major: 'Unknown',
          tag: '#kevenGallegos',
          source: Evan,
          facebook: 'https://www.google.com/',
          linkedin: 'https://www.google.com/',
          github: 'https://www.google.com/'
        },
        {
          name: 'Keven Gallegos',
          major: 'B.S Mechanical Engineering',
          tag: '#DonRobertPornaras',
          source: Evan,
          facebook: 'https://www.google.com/',
          linkedin: 'https://www.google.com/',
          github: 'https://www.google.com/'
        },
        {
          name: 'Thenu Senthil',
          major: 'B.S Computer Engineering',
          tag: '#ThenuSenthil',
          source: Evan,
          facebook: 'https://www.google.com/',
          linkedin: 'https://www.google.com/',
          github: 'https://www.google.com/'
        },
        {
          name: 'Alisha Mehndiratta',
          major: 'B.S Software Engineering',
          tag: '#AlishaMehndiratta',
          source: Evan,
          facebook: 'https://www.google.com/',
          linkedin: 'https://www.google.com/',
          github: 'https://www.google.com/'
        },
        {
          name: 'Lorena Silva',
          major: 'B.S Computer Engineering',
          tag: '#LorenaSilva',
          source: Evan,
          facebook: 'https://www.google.com/',
          linkedin: 'https://www.google.com/',
          github: 'https://www.google.com/'
        },
        {
          name: 'Nick Derry',
          major: 'B.S Computer Engineering',
          tag: '#Nick Derry',
          source: Evan,
          facebook: 'https://www.google.com/',
          linkedin: 'https://www.google.com/',
          github: 'https://www.google.com/'
        },
        {
          name: 'Aris Koumis v1',
          major: 'B.S Computer Engineering',
          tag: '#ArisKoumis',
          source: Evan,
          facebook: 'https://www.google.com/',
          linkedin: 'https://www.google.com/',
          github: 'https://www.google.com/'
        },
        {
          name: 'Aris Koumis v2',
          major: 'B.S Computer Engineering',
          tag: '#ArisKoumis',
          source: Evan,
          facebook: 'https://www.google.com/',
          linkedin: 'https://www.google.com/',
          github: 'https://www.google.com/'
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
            {this.state.json.map((obj, index) => (
              <OfficerCard key={index} {...obj} index={index} />
            ))}
          </div>
        </TabContent>
      </>
    )
  }
}
