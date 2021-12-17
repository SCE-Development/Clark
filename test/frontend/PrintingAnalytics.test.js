/* global describe it */
import 'jsdom-global/register';
import React from 'react';
import { expect } from 'chai';
import { Line, Pie } from 'react-chartjs-2';
import PrintingAnalytics from
'../../src/Pages/PrintingAnalytics/PrintingAnalytics';
import { shallow } from 'enzyme';

describe('<PrintingAnalytics />', () => {
  it('Should render a <Line /> tag', () => {
    const wrapper = shallow(<PrintingAnalytics />);
    expect(wrapper.find(Line));
  });
  it('Should render a <Pie /> tag', () => {
    const wrapper = shallow(<PrintingAnalytics />);
    expect(wrapper.find(Pie));
  });
});
