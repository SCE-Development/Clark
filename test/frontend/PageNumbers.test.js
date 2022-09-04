// https://masteringjs.io/tutorials/sinon/stub-called-with
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
  // should call paginate with correct number when button clicked,
  // do this with evan later

});
