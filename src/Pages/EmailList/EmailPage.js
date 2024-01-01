import React, { Component } from 'react';
import EmailList from './EmailList';
import EmailTemplate from './EmailTemplate';

import { Row, TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';

export default class EmailPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: 'email-list',
    };
  }

  handleActiveTab = (activeTab) => {
    this.setState({ activeTab });
  };

  render() {
    const headerProps = {
      title: 'Email Page',
    };

    return (
      <div className="email-page">
        <Header {...headerProps} />
        <div id="email-tabs">
          <Nav tabs>
            <NavItem>
              <NavLink
                onClick={() => {
                  this.handleActiveTab('email-list');
                }}
                className={
                  this.state.activeTab === 'email-list' ?
                    'tab-active' : 'tab-nonactive'
                }
              >
                Email List
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                onClick={() => {
                  this.handleActiveTab('send-emails');
                }}
                className={
                  this.state.activeTab === 'send-emails' ?
                    'tab-active' : 'tab-nonactive'
                }
              >
                Send Emails
              </NavLink>
            </NavItem>
          </Nav>
          <TabContent activeTab={this.state.activeTab}>
            <TabPane tabId="email-list">
              <EmailList user={this.props.user} />
            </TabPane>
            <TabPane tabId="send-emails">
              <Row>
                <EmailTemplate user={this.props.user} />
              </Row>
            </TabPane>
          </TabContent>
        </div>
      </div>
    );
  }
}
