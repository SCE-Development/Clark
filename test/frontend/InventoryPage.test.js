/* global describe it */
import 'jsdom-global/register';
import React from 'react';
import Enzyme, { mount } from 'enzyme';
import { expect } from 'chai';
import InventoryPage from '../../src/Pages/Inventory/InventoryPage';
import Adapter from 'enzyme-adapter-react-16';
import { Alert, Table } from 'reactstrap';

Enzyme.configure({ adapter: new Adapter() });

describe('<InventoryPage />', () => {
  const wrapper = mount(<InventoryPage />);

  it('Should render 1 Alert', () => {
    expect(wrapper.find(Alert)).to.have.lengthOf(1);
  });

  it('Should render 1 Table', () => {
    expect(wrapper.find(Table)).to.have.lengthOf(1);
  });

  it('Should render 1 React component: AddItemButtonModal', () => {
    expect(wrapper.find('AddItemButtonModal')).to.have.lengthOf(1);
  });
});
