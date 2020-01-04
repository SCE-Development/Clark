/* global describe it */
import 'jsdom-global/register'
import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import { expect } from 'chai'
import { DropdownItem, Input } from 'reactstrap'

import MajorDropdown from '../../src/Pages/MembershipApplication/MajorDropdown'
import Adapter from 'enzyme-adapter-react-16'

Enzyme.configure({ adapter: new Adapter() })

describe('<MajorDropdown />', () => {
  const wrapper = shallow(<MajorDropdown />)
  const dropdownItemArray = wrapper.find(DropdownItem)
  it('Should render three <DropdownItem /> components for CMPE, SE and Other', () => {
    expect(dropdownItemArray.length).to.equal(3)
    expect(dropdownItemArray.get(0).props.value).to.equal(
      'Computer Engineering'
    )
    expect(dropdownItemArray.get(1).props.value).to.equal(
      'Software Engineering'
    )
    expect(dropdownItemArray.get(2).props.value).to.equal('Other')
  })
  it('Should hide an input box by default if "Other" is not selected', () => {
    expect(wrapper.find(Input)).to.have.lengthOf(0)
  })
  it('Should show an input box by default if "Other" is selected', () => {
    const appProps = {
      inputEnable: true
    }
    const dropdownWrapper = shallow(<MajorDropdown {...appProps} />)
    expect(dropdownWrapper.find(Input)).to.have.lengthOf(1)
  })
})
