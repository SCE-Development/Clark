import React, { Component } from "react";
import "./email-page.css";
import EmailList from "./EmailList";
import EmailTemplate from "./EmailTemplate";
import Header from "../../Components/Header/Header";
import { Row, TabContent, TabPane, Nav, NavItem, NavLink } from "reactstrap";

export default class EmailPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: "1",
    };
  }

  handleActiveTab = (activeTab) => {
    this.setState({ activeTab });
  };

  render() {
    const headerProps = {
      title: "Email Page",
    };

    return (
      <div className="email-page">
        <Header {...headerProps} />
        <div id="email-tabs">
          <Nav tabs>
            <NavItem>
              <NavLink
                onClick={() => {
                  this.handleActiveTab("1");
                }}
                className={
                  this.state.activeTab === "1" ? "tab-active" : "tab-nonactive"
                }
              >
                Email List
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                onClick={() => {
                  this.handleActiveTab("2");
                }}
                className={
                  this.state.activeTab === "2" ? "tab-active" : "tab-nonactive"
                }
              >
                Send Emails
              </NavLink>
            </NavItem>
          </Nav>
          <TabContent activeTab={this.state.activeTab}>
            <TabPane tabId="1">
              <EmailList user={this.props.user} />
            </TabPane>
            <TabPane tabId="2">
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
