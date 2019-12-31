/* global describe it */
import 'jsdom-global/register'
import React from 'react'
import Enzyme, { mount } from 'enzyme'
import { expect } from 'chai'

import OfficerManager from '../../src/Pages/OfficerDB/OfficerDB'
import OfficerManagerTableRow from '../../src/Pages/OfficerDB/InfoRow'
import OfficerManagerTableRowAdder from '../../src/Pages/OfficerDB/Edits/Adder'
import OfficerManagerTableRowEditor from '../../src/Pages/OfficerDB/Edits/Editor'
import OfficerManagerTableRowConfirm from '../../src/Pages/OfficerDB/Edits/ConfirmationModule'
import { DropdownItem } from 'reactstrap'
import Adapter from 'enzyme-adapter-react-16'

Enzyme.configure({ adapter: new Adapter() })

const propsUser = {
  token: 'token',
  email: 'emai'
}

const propsOfficers = [
  {
    name: 'name',
    role: 'President',
    linkedIn: 'linkedIn'
  }
]

const propsUsers = [
  {
    firstName: 'first',
    lastName: 'last',
    middleInitial: 'm'
  }
]

const enums = require('../../src/Enums')

describe('<OfficerManager />', () => {
  const wrapper = mount(<OfficerManager user={propsUser} />)
  const fields = ['Name', 'Role', 'LinkedIn', 'Github', 'Quote', 'Edit']

  it('Should render a <th /> component with 7 child', () => {
    expect(wrapper.find('th')).to.have.lengthOf(7)
    for (let i = 0; i < 6; i++) {
      expect(wrapper.find('th').get(i).props.children).equals(fields[i])
    }
  })
})

describe('<OfficerManagerTableRow />', () => {
  const wrapper = mount(
    <OfficerManagerTableRow
      officer={propsOfficers[0]}
      user={propsUser}
      getOfficers={() => {}}
      deleteOfficer={() => {}}
    />
  )

  it('Should render a <td /> component with 7 children', () => {
    expect(wrapper.find('td')).to.have.lengthOf(7)
    expect(wrapper.find('td').get(0).props.children).equals(
      propsOfficers[0].name
    )
    expect(wrapper.find('td').get(1).props.children).equals(
      propsOfficers[0].role
    )
    expect(wrapper.find('td').get(2).props.children).equals(
      propsOfficers[0].linkedIn
    )
    expect(wrapper.find('td').get(3).props.children).equals(undefined)
    expect(wrapper.find('td').get(4).props.children).equals(undefined)
  })
})

describe('<OfficerManagerTableRowAdder />', () => {
  const wrapper = mount(
    <OfficerManagerTableRowAdder
      user={propsUser}
      users={propsUsers}
      toggle
      getOfficers={() => {}}
      setToggle={() => {}}
    />
  )

  it('Should render a <DropdownItem /> component with 14 children', () => {
    expect(wrapper.find(DropdownItem)).to.have.lengthOf(14)

    // user selection
    const expectedName = ['first', ' ', 'last', ' ', 'm', '.']
    for (let i = 0; i < expectedName.length; i++) {
      expect(wrapper.find(DropdownItem).get(2).props.children[i]).equals(
        expectedName[i]
      )
    }

    // roles selection
    const roles = [
      ...Object.values(enums.officerRole),
      ...Object.values(enums.chairRole)
    ]
    for (let i = 3; i < 14; i++) {
      expect(wrapper.find(DropdownItem).get(i).props.children).equals(
        roles[i - 3]
      )
    }
  })

  it('Should render a <OfficerManagerTableRowConfirm /> component with one child', () => {
    expect(wrapper.find(OfficerManagerTableRowConfirm)).to.have.lengthOf(1)
  })
})

describe('<OfficerManagerTableRowEditor />', () => {
  const wrapper = mount(
    <OfficerManagerTableRowEditor
      toggle
      officer={propsOfficers[0]}
      user={propsUser}
      getOfficers={() => {}}
      setToggle={() => {}}
    />
  )

  it('Should render a <DropdownItem /> component with 13 children', () => {
    expect(wrapper.find(DropdownItem)).to.have.lengthOf(13)

    // roles selection
    const roles = [
      ...Object.values(enums.officerRole),
      ...Object.values(enums.chairRole)
    ]
    for (let i = 2; i < 13; i++) {
      expect(wrapper.find(DropdownItem).get(i).props.children).equals(
        roles[i - 2]
      )
    }
  })

  it('Should render a <OfficerManagerTableRowConfirm /> component with one child', () => {
    expect(wrapper.find(OfficerManagerTableRowConfirm)).to.have.lengthOf(1)
  })
})
