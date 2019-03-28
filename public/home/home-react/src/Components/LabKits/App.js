import React from 'react';
import { NavbarBrand, ListGroup, ListGroupItem, ListGroupItemHeading, ListGroupItemText } from 'reactstrap';

export default class CMPELabKits extends React.Component {
  render() {
    return (
      <ListGroup>
        <ListGroupItem>
          <ListGroupItemHeading> Mouser Order (CMOS Chips)</ListGroupItemHeading>
          <ListGroupItemText>
            <ListGroupItem> Order components such as resistors, capacitors, crystals, logic chips, etc. for your CMPE 124 class.</ListGroupItem>
            <ListGroupItem> Use this <a href="https://www.mouser.com/ProjectManager/ProjectDetail.aspx?AccessID=c54b2e8c61">link</a>, press the green order button, and follow the ordering instructions.</ListGroupItem>
          </ListGroupItemText>
        </ListGroupItem>
        <ListGroupItem>
          <ListGroupItemHeading> Amazon Order </ListGroupItemHeading>
          <ListGroupItemText>
            <ListGroupItem> Oscilloscope probes, banana cables, and electronics book.</ListGroupItem>
            <ListGroupItem> Use this <a href="http://a.co/bnKDCC7">link</a>, add each item to cart, and proceed to check out.</ListGroupItem>
            <ListGroupItem> WARNING: Purchasing “Practical Electronics for Inventors, Fourth Edition” is optional.</ListGroupItem>
          </ListGroupItemText>
        </ListGroupItem>
        <ListGroupItem>
          <ListGroupItemHeading> Circuit Specialists </ListGroupItemHeading>
          <ListGroupItemText>
            <ListGroupItem> Order WB-106-1+J Solderless breadboard with jumpers.</ListGroupItem>
            <ListGroupItem> Use this <a href="https://www.circuitspecialists.com/wb-106+j.html">link</a> and add breadboard to cart and proceed to checkout.</ListGroupItem>
          </ListGroupItemText>
        </ListGroupItem>
      </ListGroup>
    );
  }
}
