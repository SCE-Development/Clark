import 'jsdom-global/register';
import React from 'react';
import Enzyme, { mount } from 'enzyme';
import { expect } from 'chai';
import Adapter from '@cfaester/enzyme-adapter-react-18';

import AboutPage from '../../src/Pages/About/About';

Enzyme.configure({ adapter: new Adapter() });

describe('<AboutPage />', () => {
  const wrapper = mount(<AboutPage />);
  it('Should render the main heading', () => {
    expect(wrapper.find('h1').text()).to.equal('What Happens at SCE');
  });
  it('Should render the Introduction text', () => {
    const subheading = wrapper.find('h2').at(0);
    expect(subheading.text()).to.include('Introduction');
  });
  it('Should render the Location text', () => {
    const subheading = wrapper.find('h2').at(1);
    expect(subheading.text()).to.include('Location');
  });
  it('Should render club hours information', () => {
    const preformatted = wrapper.find('pre').at(0);
    expect(preformatted.text()).to.include('Monday - Thursday: 10:00 AM - 5:00 PM');
    expect(preformatted.text()).to.include('Friday:            10:00 AM - 2:00 PM');
  });
  it('Should render membership fee information', () => {
    const companies = wrapper.find('pre').at(1);
    expect(companies.text()).to.include('Single semester: $20');
    expect(companies.text()).to.include('Two semesters:   $30');
  });
  it('Should render the image with the correct alt text', () => {
    expect(wrapper.find('img').prop('alt')).to.equal('sce collage');
  });
  it('Should render the link to Discord with the correct URL', () => {
    const discordLink = wrapper.find('a').at(0);
    expect(discordLink.prop('href')).to.equal('https://sce.sjsu.edu/s/discord');
    expect(discordLink.text()).to.equal('https://sce.sjsu.edu/s/discord');
  });
});
