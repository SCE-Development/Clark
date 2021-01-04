/* global describe it */
import 'jsdom-global/register';
import React from 'react';
import Enzyme, { mount } from 'enzyme';
import { expect } from 'chai';
import { modalStates } from '../../src/Enums';

import SummaryModal from '../../src/Pages/Lessons/SummaryModal';
import Adapter from 'enzyme-adapter-react-16';
import {
  Button,
  Input,
  InputGroupAddon
} from 'reactstrap';

Enzyme.configure({ adapter: new Adapter() });

describe('<SummaryModal />', () => {
  const appProps = {
    showSummaryModal: true,
    modalState: modalStates.EDIT,
    SummaryToggle: () => {},
    summary: 'This is the summary'
  };

  const wrapper = mount(<SummaryModal { ...appProps } />);

  it('Should render input label for Summary', () => {
    expect(wrapper.find(InputGroupAddon).get(0).props.children)
      .to
      .equal('Summary*');
    expect(wrapper.find(Input).get(0).props.type).to.equal('textarea');
  });
  it('Should populate the input for Summary', () => {
    expect(wrapper.find(Input).get(0).props.defaultValue).to.equal(
      appProps.summary
    );
  });
  describe('<SummaryModal /> buttons', () => {
    const buttonArray = wrapper.find(Button);
    it('Should render 2 buttons', () => {
      expect(buttonArray).to.have.lengthOf(2);
    });
    it('Should render Cancel and Submit Changes buttons', () => {
      expect(buttonArray.get(0).props.children).to.equal('Cancel');
      expect(buttonArray.get(1).props.children).to.equal(
        'Submit Changes'
      );
    });
  });
});
