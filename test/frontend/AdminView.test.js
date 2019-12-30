/* global describe it */
import 'jsdom-global/register'
import React from 'react'
import Enzyme, { mount } from 'enzyme'
import { expect } from 'chai'
import 'regenerator-runtime/runtime'

import AdminViewEditor from '../../src/Pages/Profile/admin/AdminView'
import AdminEditorForm from '../../src/Pages/Profile/admin/EditorForm'
import AdminProfileEditor from '../../src/Pages/Profile/admin/Profile'
import Adapter from 'enzyme-adapter-react-16'

Enzyme.configure({ adapter: new Adapter() })

describe('<AdminViewEditor />', () => {
  const user = {
    accessLevel: 2,
    firstName: 'First',
    lastName: 'Last',
    middleInitial: 'I',
    joinDate: '12-32-2012htzs342',
    membershipValidUntil: '12-32-2012htzs342',
    email: 'email',
    major: 'major',
    pagesPrinted: 20
  }
  const wrapper = mount(<AdminViewEditor user={user} token='token' />)

  it('Should render a <AdminProfileEditor /> component with one child', () => {
    expect(wrapper.find(AdminProfileEditor)).to.have.lengthOf(1)
  })

  it('Should render a <AdminEditorForm /> component with one child', () => {
    expect(wrapper.find(AdminEditorForm)).to.have.lengthOf(1)
  })
})
