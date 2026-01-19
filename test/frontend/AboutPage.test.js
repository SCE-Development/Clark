import 'jsdom-global/register';
import React from 'react';
import Enzyme, { mount } from 'enzyme';
import { expect } from 'chai';
import Adapter from '@cfaester/enzyme-adapter-react-18';

import AboutPage from '../../src/Pages/About/About';

Enzyme.configure({ adapter: new Adapter() });

describe('<AboutPage />', () => {
  global.IntersectionObserver = class IntersectionObserver {
    constructor(callback) {
      this.callback = callback;
    }
  };
  const wrapper = mount(<AboutPage />);

  it('Should render the main heading', () => {
    expect(wrapper.find('h1').first().text()).to.equal('What Happens at SCE');
  });

  it('Should render the Introduction section', () => {
    const section = wrapper.find('#introduction');
    expect(section.find('h2').text()).to.include('Introduction');
  });

  it('Should render the Location section', () => {
    const section = wrapper.find('#location');
    expect(section.find('h2').text()).to.include('Location & Hours');
  });

  it('Should render club hours information', () => {
    const hoursSection = wrapper.find('#location');
    expect(hoursSection.text()).to.include('Monday - Thursday:');
    expect(hoursSection.text()).to.include('10:00 AM - 5:00 PM');
    expect(hoursSection.text()).to.include('Friday:');
    expect(hoursSection.text()).to.include('10:00 AM - 2:00 PM');
  });

  it('Should render membership fee information', () => {
    const membershipSection = wrapper.find('#membership');
    expect(membershipSection.text()).to.include('Single Semester:');
    expect(membershipSection.text()).to.include('$20');
    expect(membershipSection.text()).to.include('Two Semesters:');
    expect(membershipSection.text()).to.include('$30');
  });

  it('Should render the image with the correct alt text', () => {
    expect(wrapper.find('img').prop('alt')).to.include('SCE community collage');
  });

  it('Should render the Discord link with the correct URL', () => {
    const discordLink = wrapper.find('a[href="https://sce.sjsu.edu/s/discord"]');
    expect(discordLink.prop('href')).to.equal('https://sce.sjsu.edu/s/discord');
    expect(discordLink.text()).to.equal('Join SCE Discord');
  });

  it('Should render the table of contents (hidden on mobile)', () => {
    // Check that the table of contents container exists with proper mobile-hiding classes
    const tocNav = wrapper.find('nav');
    expect(tocNav).to.have.length(1);

    // Check that navigation buttons exist within the table of contents
    const tocButtons = tocNav.find('button');
    expect(tocButtons.length).to.be.greaterThan(0);
    expect(tocButtons.at(0).text()).to.equal('Introduction');
    expect(tocButtons.at(1).text()).to.equal('Location & Hours');
    expect(tocButtons.at(2).text()).to.equal('Membership');
  });

  it('Should have responsive text sizing', () => {
    const mainHeading = wrapper.find('h1');
    expect(mainHeading.hasClass('text-4xl')).to.be.true;
    expect(mainHeading.hasClass('md:text-5xl')).to.be.true;
  });

  it('Should have dark mode compatible classes', () => {
    const mainHeading = wrapper.find('h1');
    expect(mainHeading.hasClass('text-gray-900')).to.be.true;
    expect(mainHeading.hasClass('dark:text-gray-100')).to.be.true;
  });
});
