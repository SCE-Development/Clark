/* global describe it */
import 'jsdom-global/register'
import React from 'react'
import Enzyme, { mount } from 'enzyme'
import { expect } from 'chai'

import MemberTable from '../../src/Pages/TheTeam/TheTeam'
import Adapter from 'enzyme-adapter-react-16'
import { CarouselItem, Carousel } from 'reactstrap'

Enzyme.configure({ adapter: new Adapter() })

describe('<MemberTable />', () => {
})
