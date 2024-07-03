import 'jsdom-global/register';
import React from 'react';
import Enzyme, { mount } from 'enzyme';
import { expect } from 'chai';
import Adapter from '@cfaester/enzyme-adapter-react-18';

import ConfirmationModal from '../../src/Components/DecisionModal/ConfirmationModal';

Enzyme.configure({ adapter: new Adapter() });

describe('<ConfirmationModal />', () => {
  const modalProps = {
    headerText: 'This the test header',
    bodyText: 'test body',
  };
  const wrapper = mount(<ConfirmationModal {...modalProps} />);
  it('Should render the headerText prop in a h3 tag', () => {
    expect(wrapper.find('h3').text()).to.equal(modalProps.headerText);
  });
  it('Should render the bodyText prop in a p tag', () => {
    expect(wrapper.find('p').text()).to.equal(modalProps.bodyText);
  });
  it('Should render \'Confirm\' when no prop is passed', () => {
    const wrapper = mount(<ConfirmationModal />);
    expect(wrapper.find('button').at(0).text()).to.equal('Confirm');
  });
  it('Should render \'Cancel\' when no prop is passed', () => {
    const wrapper = mount(<ConfirmationModal />);
    expect(wrapper.find('button').at(1).text()).to.equal('Cancel');
  });
});
