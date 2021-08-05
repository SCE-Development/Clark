import React, { Component } from 'react';
import './email-list.css';
import { getAllUsers, filterUsers } from '../../APIFunctions/User';
import {
  Button,
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';
import * as countTime from '../../userTimeTraffic.js';

export default class EmailList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      filteredUsers: [],
      filtered: false,
      dropdownOpen: false,
    };
  }

  componentDidMount() {
    if (this.props.user) {
      this.getUsers();
    }
    window.addEventListener('onload', countTime.onLoad);
    document.addEventListener('visibilitychange', countTime.visibilityChange);
  }

  componentWillUnmount() {
    window.removeEventListener('onload', countTime.onLoad);
    document.removeEventListener('visibilitychange',
      countTime.visibilityChange);
  }

  handleToggle = () => {
    this.setState({ dropdownOpen: !this.state.dropdownOpen });
  };

  getUsers = async () => {
    const apiResponse = await getAllUsers(this.props.user.token);
    if (!apiResponse.error) {
      this.setState({ users: apiResponse.responseData });
    }
  };

  // Copies all emails onto clipboard
  handleCopyEmails = () => {
    let range = document.createRange();
    range.selectNode(document.getElementById('email-list'));
    window.getSelection().removeAllRanges(); // clear current selection
    window.getSelection().addRange(range); // to select text
    document.execCommand('copy');
    window.getSelection().removeAllRanges(); // to deselect
    document.getElementById('copy-notification1').style.display = 'block';
  };

  getFilteredUsers = (filterID) => {
    let filteredUsers = filterUsers(this.state.users, filterID);
    this.setState({ filteredUsers, filtered: true });
  };

  render() {
    let filterItems = [
      { filterID: 0, label: 'Valid Members' },
      { filterID: 1, label: 'Non-Valid Members' },
      { filterID: 2, label: 'Everyone' },
    ];
    return (
      <div className="email">
        <div id="email-list-filter">
          <ButtonDropdown
            isOpen={this.state.dropdownOpen}
            toggle={this.handleToggle}
          >
            <DropdownToggle caret id="email-filter-button">
              Filter by
            </DropdownToggle>
            <DropdownMenu>
              {filterItems.map((item, i) => {
                return (
                  <DropdownItem
                    key={i}
                    onClick={() => {
                      this.getFilteredUsers(item.filterID);
                    }}
                  >
                    {item.label}
                  </DropdownItem>
                );
              })}
            </DropdownMenu>
          </ButtonDropdown>
          <Button
            outline
            id="email-copy-button"
            onClick={this.handleCopyEmails}
          >
            Copy to Clipboard
          </Button>
          Number of Emails:{' '}
          {this.state.filtered
            ? this.state.filteredUsers.length
            : this.state.users.length}
          <p id="copy-notification1">Copied emails to clipboard! :)</p>
        </div>
        <div id="email-list">
          {this.state.filtered ? this.state.filteredUsers.map((user, i) => {
            return (
              <p key={i}>
                {user.email}
                {i === this.state.filteredUsers.length - 1 ? (
                  ''
                ) : (<>,&nbsp;</>)}</p>
            );
          })
            : this.state.users.map((user, i) => {
              return (
                <p key={i}>
                  {user.email}
                  {i === this.state.users.length - 1 ? '' : <>,&nbsp;</>}
                </p>
              );
            })}
        </div>
      </div>
    );
  }
}
