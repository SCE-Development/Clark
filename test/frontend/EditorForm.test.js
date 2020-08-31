/* global describe it */
import 'jsdom-global/register';
import React from 'react';
import Enzyme, { mount } from 'enzyme';
import { expect } from 'chai';
import 'regenerator-runtime/runtime';

import AdminEditorForm from '../../src/Pages/Profile/admin/EditorForm';
import Adapter from 'enzyme-adapter-react-16';
import { Modal, Button, FormGroup } from 'reactstrap';

Enzyme.configure({ adapter: new Adapter() });

describe('<AdminEditorForm />', () => {
  const membershipState = require('../../src/Enums').membershipState;

  const membership = [
    { value: membershipState.ADMIN, name: 'Keep Same' },
    { value: membershipState.MEMBER, name: '2 semesters' }
  ];

  const formGroups = [
    {
      label: 'First Name',
      placeholder: 'First',
      handleChange: () => {}
    },
    {
      label: 'Last Name',
      placeholder: 'Last',
      handleChange: () => {}
    }
  ];

  const wrapper = mount(
    <AdminEditorForm
      formGroups={formGroups}
      membership={membership}
      setNumberOfSemestersToSignUpFor={() => {}}
      setPagesPrinted={() => {}}
      handleSubmissionToggle={() => {}}
      handleToggle={() => {}}
      setuserMembership={() => {}}
      toggle
    />
  );

  it('Should render a <Modal /> component with one child', () => {
    expect(wrapper.find(Modal)).to.have.lengthOf(1);
  });

  it('Should render a <Button /> component with 3 children', () => {
    const component = wrapper.find(Button);
    expect(component).to.have.lengthOf(4);
    expect(component.get(0).props.children).equals('Edit');
    expect(component.get(1).props.children).equals('Assign Door Code');
    expect(component.get(2).props.children).equals('Submit');
    expect(component.get(3).props.children).equals('Cancel');
  });

  it('Should render a <FormGroup /> component with 11 children', () => {
    const component = wrapper.find(FormGroup);
    expect(component).to.have.lengthOf(11);
    expect(component.get(0).props.children[1].props.placeholder).equals(
      formGroups[0].placeholder
    );
    expect(component.get(1).props.children[1].props.placeholder).equals(
      formGroups[1].placeholder
    );
    expect(component.get(2).props.children[0].props.children).equals(
      'Reset Pages!'
    );
    expect(component.get(3).props.children[0].props.children).equals(
      'Membership Status'
    );
  });
});
