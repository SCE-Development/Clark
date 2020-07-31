/* global describe it after */
import 'jsdom-global/register';
import React from 'react';
import Enzyme, { mount } from 'enzyme';
import { expect } from 'chai';
import 'regenerator-runtime/runtime';

import UserProfile from '../../src/Pages/Profile/MemberView/Profile';
import InfoCard from '../../src/Pages/Profile/MemberView/InfoCard';
import ChangePassword from '../../src/Pages/Profile/MemberView/ChangePassword';
import PrintRequest from '../../src/Pages/Profile/MemberView/PrintRequest';
import { mockMonth, revertClock } from '../util/mocks/Date';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

describe('<UserProfile />', () => {
	after((done) => {
		// get rid of the stub
		revertClock();
		done();
	});

	const user = {
		token: 'token'
	};

	const obj = [
		{ title: '2D Prints', value: '', icon: 'First Hello' },
		{ title: 'Request 3D Printing', value: 'Print Request', icon: 'Second Hello' },
		{ title: 'Connect with Discord', value: '', icon: 'Hello World' },
		{ title: 'Change Password', value: 'Change Password', icon: 'Last Hello' }
	];

	let wrapper = mount(<UserProfile user={user} />);

	let infoWrapper = mount(<InfoCard fields={obj} />);

	it(`Should render div component with ${obj.length * 2 + 2} children`, () => {
		expect(infoWrapper.find('div')).to.have.lengthOf(obj.length * 2 + 2);
	});

	it(`Should render b component with ${obj.length + 2} children`, () => {
		expect(infoWrapper.find('b')).to.have.lengthOf(obj.length + 2);
	});

	it(`Should render h3 component with ${obj.length} children`, () => {
		expect(infoWrapper.find('h3')).to.have.lengthOf(obj.length);
	});

	it(`Should render span component with ${obj.length} children`, () => {
		for (let i = 0; i < obj.length; i++) {
			expect(infoWrapper.find('span').get(i).props.children).equal(obj[i].icon);
		}
		expect(infoWrapper.find('span')).to.have.lengthOf(obj.length);
	});
});
