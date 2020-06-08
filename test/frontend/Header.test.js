import 'jsdom-global/register';
import React from 'react';
import Enzyme, { mount } from 'enzyme';
import { expect } from 'chai';
import Adapter from 'enzyme-adapter-react-16';
import { Jumbotron } from 'reactstrap';

import Header from '../../src/Components/Header/Header';

Enzyme.configure({ adapter: new Adapter() });
const headerProps = {
  title: 'Test Header'
};

describe('<Header />', () => {
  it('Should render a <Header> component', () => {
    const wrapper = mount(<Header {...headerProps} />);
    expect(wrapper.find(Jumbotron)).to.have.lengthOf(1);
  });
});
