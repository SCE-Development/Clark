/* global describe it */
import 'jsdom-global/register';
import React from 'react';
import Enzyme, { mount } from 'enzyme';
import { expect } from 'chai';

import ConfirmationModal from
  '../../src/Components/DecisionModal/ConfirmationModal.js';
import Adapter from 'enzyme-adapter-react-16';
import { Button, ModalHeader, ModalBody, Modal } from 'reactstrap';

Enzyme.configure({ adapter: new Adapter() });

describe('<ConfirmationModal />', () => {
  const appProps = {
    headerText: 'Hi thai',
    bodyText: 'how are you?',
    toggle: () => {},
    handleConfirmation: () => {},
    open: true,
    confirmText: 'breadboard',
    cancelText: 'You sure about this thai?'
  };
  const wrapper = mount(<ConfirmationModal {...appProps} />);
  it('Should be open when sent the correct props', () => {
    expect(wrapper.find(Modal).get(0).props.isOpen).to.eql(appProps.open);
  });
  it('Should render two buttons', () => {
    expect(wrapper.find(Button)).to.have.lengthOf(2);
  });
  it('Should render the Modal Header', () => {
    expect(wrapper.find(ModalHeader).get(0).props.children).to.eql(
      appProps.headerText
    );
  });
  it('Should render the Modal Body', () => {
    expect(wrapper.find(ModalBody).get(0).props.children).to.eql(
      appProps.bodyText
    );
  });
  it('Should render the Cancel Text', () => {
    expect(wrapper.find(Button).get(0).props.children).to.eql(
      appProps.confirmText
    );
  });
  it('Should render the Confirm Text', () => {
    expect(wrapper.find(Button).get(1).props.children).to.eql(
      appProps.cancelText
    );
  });
});
