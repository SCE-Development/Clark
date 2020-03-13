/* global describe it */
import 'jsdom-global/register';
import React from 'react';
import Enzyme, { mount } from 'enzyme';
import { expect } from 'chai';

import Slideshow from '../../src/Components/Slideshow/Slideshow';
import Adapter from 'enzyme-adapter-react-16';
import { CarouselItem, Carousel } from 'reactstrap';

Enzyme.configure({ adapter: new Adapter() });

describe('<Slideshow />', () => {
  it('Should render a <Carousel /> component', () => {
    const wrapper = mount(<Slideshow />);
    expect(wrapper.find(Carousel)).to.have.lengthOf(1);
  });
  it('Should render 8 <CarouselItem /> components with 2 children', () => {
    const wrapper = mount(<Slideshow />);
    expect(wrapper.find(CarouselItem)).to.have.lengthOf(8);
    expect(wrapper.find('#caption-4').children()).to.have.lengthOf(2);
  });
});
