// import React, { Component, Button } from 'react'
import Iframe from 'react-iframe'

const MyCalendar = props => (
  <div>
    <Iframe
      src='https://calendar.google.com/calendar/embed?src=llv828585faitko1m2nh39s3js%40group.calendar.google.com&ctz=America%2FLos_Angeles'
      style='border: 0'
      width='2400'
      height='600'
      frameborder='0'
      scrolling='no'
    />
  </div>
)

export default MyCalendar
