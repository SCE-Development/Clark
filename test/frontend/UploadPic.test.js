import React from 'react';
import Enzyme, { mount } from 'enzyme';
import { expect } from 'chai';
import { FilePond } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import { Button } from 'reactstrap';
import Adapter from 'enzyme-adapter-react-16';
import UploadPic from '../../src/Pages/UploadPic/UploadPic';
import { Jumbotron } from 'reactstrap';

Enzyme.configure({ adapter: new Adapter() });

describe('<UploadPic />', () => {
  const wrapper = mount(<UploadPic />);
  it('Should render a <Jumbotron /> component', () => {
    expect(wrapper.find(Jumbotron)).to.have.lengthOf(1);
  });
  it('Should render a <FilePond /> component with one child', () => {
    expect(wrapper.find(FilePond)).to.have.lengthOf(1);
  });
  it('Should render a <Button /> component with one child', () => {
    expect(wrapper.find(Button)).to.have.lengthOf(1);
  });
});
