/* global describe it */
import 'jsdom-global/register'
import React from 'react'
import Enzyme, { mount } from 'enzyme'
import { expect } from 'chai'
import RequestForm from '../../src/Pages/3DPrintingConsole/RequestForm'
import Adapter from 'enzyme-adapter-react-16'
import { Button, Col } from 'reactstrap'

Enzyme.configure({ adapter: new Adapter() })

describe('<RequestForm />', () => {
  const appProps = {
    item: {
      projectLink: 'https://sce.engr.sjsu.edu',
      projectComments: 'This is the project comment!',
      projectContact: 'test@gmail.com',
      color: 'blue',
      date: '2020-02-19T04:40:35.617Z',
      progress: 'Rejected'
    }
  }
  const wrapper = mount(<RequestForm {...appProps} />)

  it('Should render four <Button /> components', () => {
    expect(wrapper.find(Button)).to.have.lengthOf(4)
  })

  it('Should render the email of a 3D print request', () => {
    expect(wrapper.find(Col).get(3).props.children[1]).to.equal(
      appProps.item.projectContact
    )
  })
  it('Should render the date of a 3D print request', () => {
    expect(wrapper.find(Col).get(4).props.children[1]).to.equal(
      appProps.item.date
    )
  })
  it('Should render the progress of a 3D print request', () => {
    expect(wrapper.find(Col).get(5).props.children[1]).to.equal(
      appProps.item.progress
    )
  })
  it('Should render the link of a 3D print request', () => {
    expect(wrapper.find(Col).get(7).props.children).to.equal(
      `Print Link: ${appProps.item.projectLink}`
    )
  })
  it('Should render the color of a 3D print request', () => {
    expect(wrapper.find(Col).get(8).props.children).to.equal(
      `Print Color: ${appProps.item.color}`
    )
  })
  it('Should render the comments of a 3D print request', () => {
    expect(wrapper.find(Col).get(9).props.children).to.equal(
      `Comments: ${appProps.item.projectComments}`
    )
  })
})
