/* global describe it */
import 'jsdom-global/register';
import React from 'react';
import Enzyme, { mount } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';

import PageNumbers from '../../src/Pages/Overview/PageNumbers';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

describe('<PageNumbers />', () => {

  let pageNumber = 1;
  let count = 10;
  let usersPerPage = 4;

  const object = {
    paginate: (newPage) => {
      pageNumber = newPage;
    }
  };

  const wrapper = mount(
    <PageNumbers
      paginate={object.paginate}
      pageNumber={pageNumber}
      count={count}
      usersPerPage={usersPerPage}
    />
  );

  // should render expected number of buttons given props.count
  // and props.usersPerPage
  it('Should render 3 <button /> components', () => {
    expect(wrapper.find('button')).to.have.lengthOf(3);
  });

  it('Should mark the active button with the active-page-button class', () => {
    const buttonArray = wrapper.find('button');
    const activeButton = buttonArray.get(0);
    expect(activeButton.props.className).to.equal('active-page-button');
  });

  it('Should only render one button with the active-page-button class', () => {
    const activeButtonArray = wrapper.find('.active-page-button');
    expect(activeButtonArray).to.have.lengthOf(1);
  });
  // should call paginate with correct number when button clicked,
  // do this with evan later

});
