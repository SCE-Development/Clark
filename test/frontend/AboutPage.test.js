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
    expect(wrapper.find('h1').text()).to.equal('The Next Frontier of Innovation at San José State.');
  });
  it('Should render the subheading text', () => {
    const subheading = wrapper.find('h3').at(0);
    expect(subheading.text()).to.include('The Software and Computer Engineering Society aims to provide');
  });
  it('Should render the subheading text', () => {
    const subheading = wrapper.find('h3').at(1);
    expect(subheading.text()).to.include('Come visit us');
  });
  it('Should render the image with the correct alt text', () => {
    expect(wrapper.find('img').prop('alt')).to.equal('sce collage');
  });
  it('Should render the link to Discord with the correct URL', () => {
    const discordLink = wrapper.find('a').at(0);
    expect(discordLink.prop('href')).to.equal('https://sce.sjsu.edu/s/discord');
    expect(discordLink.text()).to.equal('https://sce.sjsu.edu/s/discord');
  });
  it('Should render the section with the companies', () => {
    const companies = wrapper.find('span').at(1);
    expect(companies.text()).to.equal('COMPANIES WITH SCE ALUMNI INCLUDE');
  });
  it('Should render the section with the about joining the development team', () => {
    const title = wrapper.find('h2').at(1);
    expect(title.text()).to.include('Join Our Development Team!  Get exposed to');
  });
});
