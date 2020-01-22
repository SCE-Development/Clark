import React, { Component } from 'react'
import { Card, CardImg, CardTitle } from 'reactstrap'
import './benefits.css'
import './card-config.css'
import './card-settings.css'

class App extends Component {
  render () {
    return (
      <div className='tab'>
        <div className='App'>
          <div>
            <div className='text-center' id='title'>
              <h1 className='display-4'>sce services for members</h1>{' '}
            </div>
          </div>

          <div className='sec sec1'>
            <div className='services'>
              <Card id='shop' body outline color='secondary'>
                <CardTitle className='title'>SCE Shop</CardTitle>
                <CardImg
                  id='ishop'
                  src={require('./img/shop.png')}
                  alt='Shop'
                />
                <b>Snack Bar</b>
                <ul>
                  <li>Snacks & drinks</li>
                  <li>Frozen meals</li>
                </ul>
                <b>Lab Supplies</b>
                <ul>
                  <li>ICs, Arduino Uno</li>
                  <li>Wires,misc</li>
                </ul>
              </Card>
            </div>

            <div className='services'>
              <Card id='locker' body outline color='primary'>
                <CardTitle className='title'>SCE Lockers Service</CardTitle>
                <CardImg
                  id='ilocker'
                  src={require('./img/locker.png')}
                  alt='Locker'
                />
                <b>Storage Plan:</b>
                <ul>
                  <li>$10 fee per semester</li>
                  <li>3 members per locker</li>
                </ul>
              </Card>
            </div>

            <div className='services'>
              <Card id='techw' body outline color=''>
                <CardTitle className='title'>Technical Workshops</CardTitle>
                <CardImg
                  id='itechw'
                  src={require('./img/techw.png')}
                  alt='technical workshop'
                />
                <b>Come Learn: </b>
                <ul>
                  <li>Git</li>
                  <li>Linux</li>
                  <li>Web design</li>
                  <li>Bash, Shell, and more</li>
                </ul>
                <p>See calendar for details</p>
              </Card>
            </div>
          </div>

          <div className='sec sec2'>
            <div className='services'>
              <Card id='d2' body outline color='success'>
                <CardTitle className='title'>2D-Printing Service</CardTitle>
                <CardImg
                  id='id2'
                  src={require('./img/printer.png')}
                  alt='Printer-2D'
                />
                <b>Weekly</b>
                <p>
                  <b>Unlimited</b> printing at no additional cost
                </p>
                <p>(30-pages/week)</p>
                <ul />
              </Card>
            </div>

            <div className='services'>
              <Card id='hardware' body outline color='warning'>
                <CardTitle className='title'>
                  Hardware Hacking Station
                </CardTitle>
                <CardImg
                  id='ihardware'
                  src={require('./img/hardware.png')}
                  alt='Hardware Station'
                />
                <b>ESD Benches</b>
                <ul>
                  <li>Soldering irons & tools</li>
                  <li>Fume fans </li>
                  <li>Power supplies</li>
                  <li>Multimeters, etc</li>
                </ul>
              </Card>
            </div>

            <div className='services'>
              <Card id='after' body outline color=''>
                <CardTitle className='title'>After Hour Room Access</CardTitle>
                <CardImg
                  id='iafter'
                  src={require('./img/clock.png')}
                  alt='after'
                />
                <ul>
                  <li>
                    Available studying room and hangout space with friends
                  </li>
                  <li>We also host party, movie, and game nights</li>
                </ul>
                <p>See calendar for details</p>
              </Card>
            </div>
          </div>

          <div className='sec sec3'>
            <div className='services'>
              <Card id='d3' body outline color='info'>
                <CardTitle className='title'>3D-Printing Service</CardTitle>
                <CardImg
                  id='id3'
                  src={require('./img/3d-printer.png')}
                  alt='Printer-3D'
                />
                <b>In-house 3D Prints</b>
                <ul>
                  <li>3D Prints made on our 3D printers</li>
                </ul>
                <p>Submit orders through our online form</p>
              </Card>
            </div>

            <div className='services'>
              <Card id='monitor' body outline color='danger'>
                <CardTitle className='title'>Monitors and Keyboards</CardTitle>
                <CardImg
                  id='imonitor'
                  src={require('./img/monitor.png')}
                  alt='Monitor'
                />
                <ul>
                  <li>Every table at SCE comes with a monitor for you</li>
                  <li>Keyboards available at request</li>
                </ul>
              </Card>
            </div>

            <div className='services'>
              <Card id='calendar' body outline color=''>
                <CardTitle className='title'>Professional Events</CardTitle>
                <CardImg
                  id='icalendar'
                  src={require('./img/calendar.png')}
                  alt='calendar'
                />
                <b>Be the first to know about:</b>
                <ul>
                  <li>Company Tours</li>
                  <li>Networking Events</li>
                  <li>Alumni Dinners</li>
                </ul>
                <p>See calendar for details</p>
              </Card>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default App
