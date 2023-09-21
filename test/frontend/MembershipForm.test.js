// /* global describe it */
// import 'jsdom-global/register';
// import React from 'react';
// import Enzyme, { mount } from 'enzyme';
// import { expect } from 'chai';
// import { Input } from 'reactstrap';

// import MembershipForm from
//   '../../src/Pages/MembershipApplication/MembershipForm';
// import Adapter from 'enzyme-adapter-react-16';
// import MajorDropdown from '../../src/Pages/MembershipApplication/MajorDropdown';
// import GoogleRecaptcha from
//   '../../src/Pages/MembershipApplication/GoogleRecaptcha';

// Enzyme.configure({ adapter: new Adapter() });

// describe('<MembershipForm />', () => {
//   describe('Renders labels and inputs of correct types', () => {
//     const wrapper = mount(<MembershipForm />);
//     const inputArray = wrapper.find(Input);
//     it('Should render first name label & input fields', () => {
//       const currentInput = inputArray.get(0).props;
//       expect(currentInput.type).to.equal('text');
//     });
//     it('Should render last name label & input fields', () => {
//       const currentInput = inputArray.get(1).props;
//       expect(currentInput.type).to.equal('text');
//     });
//     it('Should render email label & input fields', () => {
//       const currentInput = inputArray.get(2).props;
//       expect(currentInput.type).to.equal('email');
//     });
//     it('Should render password label & input fields', () => {
//       const currentInput = inputArray.get(3).props;
//       expect(currentInput.type).to.equal('password');
//     });
//     it('Should a <MajorDropdown > component', () => {
//       expect(wrapper.find(MajorDropdown)).to.have.lengthOf(1);
//     });
//     it('Should render captcha component', () => {
//       expect(wrapper.find(GoogleRecaptcha));
//     });
//   });
// });
