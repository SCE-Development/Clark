import React, { Component } from 'react';
import './Overview.css';
import OverviewProfile from './OverviewProfile.js';
import { getAllUsers, deleteUserByEmail } from '../../APIFunctions/User';
import { totalUsers } from '../../APIFunctions/User';
import {
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Button
} from 'reactstrap';
import { membershipState } from '../../Enums';
import Header from '../../Components/Header/Header';

import UserManagerPageButton from './UserManagerPageButton';
import { useLocation } from 'react-router-dom';

export default class OverviewBoard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      queryResult: [],
      toggle: false,
      currentQueryType: 'All',
      queryTypes: ['All', 'Pending', 'Officer', 'Admin', 'Alumni'],
      search: '',
      count: 0,
      usersPerPage: 5,
      page: 1
    };
    this.headerProps = {
      title: 'User Manager'
    };
  }

  componentDidMount() {
    if (this.props.user) {
      this.setState(
        {
          authToken: this.props.user.token,
          currentUser: this.props.user.email,
          currentUserLevel: this.props.user.accessLevel
        },
        () => {
          this.callDatabase();
        }
      );
    }
  }

  async callDatabase() {
    const apiResponse = await getAllUsers(this.state.authToken);
    const countUsers = (await totalUsers(
      `?search=${this.state.search}`)).responseData.count;
    this.state.count = countUsers;
    // console.log(apiResponse);
    if (!apiResponse.error) this.setState({ users: apiResponse.responseData });
  }

  updateUserState(users) {
    this.setState({ users });
  }

  async updateQuery(value) {
    // taking care of empty values
    value = typeof value === 'undefined' ? '' : value;
    value = value.trim().toLowerCase();

    const countUsers = (await totalUsers(
      `?search=${this.state.search}`)).responseData.count;
    this.state.count = countUsers;
    const userExists = user => {
      return (
        user.firstName.toLowerCase().includes(value) ||
        user.lastName.toLowerCase().includes(value) ||
        user.email.toLowerCase().includes(value)
      );
    };

    const { currentQueryType } = this.state;
    const filteredUsersByLevel = this.filterUserByAccessLevel(currentQueryType);
    const searchResult = filteredUsersByLevel.filter(data => userExists(data));
    const queryResult = searchResult.length
      ? searchResult
      : filteredUsersByLevel;

    this.setState({ queryResult });
  }

  filterUserByAccessLevel(accessLevel) {
    switch (accessLevel) {
      case 'Officer':
        return this.state.users.filter(
          data => data.accessLevel === membershipState.OFFICER
        );
      case 'Admin':
        return this.state.users.filter(
          data => data.accessLevel === membershipState.ADMIN
        );
      case 'Pending':
        return this.state.users.filter(
          data => data.accessLevel === membershipState.PENDING
        );
      case 'Alumni':
        return this.state.users.filter(
          data => data.accessLevel === membershipState.ALUMNI
        );
      default:
        return this.state.users;
    }
  }

  /*
  Delete api
  parameter: Json object of object to be deleted
  */
  async deleteUser(user) {
    const deleteEmailResponse = await deleteUserByEmail(
      user.email,
      this.state.authToken
    );
    if (!deleteEmailResponse.error) {
      if (user.email === this.state.currentUser) {
        // logout
        window.localStorage.removeItem('jwtToken');
        window.location.reload();
        return window.alert('Self-deprecation is an art');
      }
      this.setState({
        users: this.state.users.filter(
          child => !child.email.includes(user.email)
        )
      });
      this.setState({
        queryResult: this.state.queryResult.filter(
          child => !child.email.includes(user.email)
        )
      });
    }
  }

  handleToggle() {
    this.setState({ toggle: !this.state.toggle });
  }

  paginate(newPage) {
    this.state.page = newPage;
    this.props.history.push(`/user-manager?search=${this.state.search}` +
      `&page=${this.state.page}`, { state: 'sample data' }
    );
    console.log(location.search);
  }

  render() {
    let numberofButtons = Math.ceil(this.state.count / this.state.usersPerPage);
    const pageNumbers = new Array();
    for (let i = 1; i <= numberofButtons; i++) {
      pageNumbers.push(i);
    }
    const renderPageNumbers = pageNumbers.map(number => {
      return (
        <Button
          key={number}
          id={number}
          onClick={() => this.paginate(number)}
        >
          {number}
        </Button>
      );
    });
    return (
      <div className='flexbox-container'>
        <br>
        </br>
        <br>
        </br>
        <div className='layout'>
          <h6 id='search-tag'>Search </h6>
          <ButtonDropdown
            isOpen={this.state.toggle}
            toggle={() => {
              this.handleToggle();
            }}
          >
            <DropdownToggle caret>{this.state.currentQueryType}</DropdownToggle>
            <DropdownMenu>
              {this.state.queryTypes.map((type, ind) => (
                <DropdownItem
                  key={ind}
                  onClick={() =>
                    this.setState({ currentQueryType: type }, () =>
                      this.updateQuery('#InvalidSearch#')
                    )}
                >
                  {type}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </ButtonDropdown>

          <a href="/email-list">
            <Button outline id="view-email-button">View Emails</Button>
          </a>

          <input
            className='input-overview'
            placeholder="search by 'first name, last name, or email'"
            onChange={event => {
              this.state.search = event.target.value;
              this.updateQuery(event.target.value);
              if (event.target.value.length > 0) {
                this.props.history.push(
                  `/user-manager?search=${event.target.value}`,
                  { state: 'sample data' }
                );
              } else {
                this.props.history.push(
                  '/user-manager?',
                  { state: 'sample data' }
                );
              }
            }}
          />

          <table className='content-table' id='users'>
            <thead>
              <tr id='users-header'>
                {[
                  'Name',
                  'Door Code',
                  'Printing',
                  'Email Verified',
                  'Membership Type',
                  '',
                  ''
                ].map((ele, ind) => {
                  return <th key={ind}>{ele}</th>;
                })}
              </tr>
            </thead>

            <tbody>
              {this.state.queryResult.length > 0
                ? this.state.queryResult.map((user, index) => {
                  return (
                    <OverviewProfile
                      key={index}
                      users={this.state.users}
                      user={user}
                      index={index}
                      token={this.state.authToken}
                      deleteUser={this.deleteUser.bind(this)}
                      updateQuery={() => {
                        this.setState(
                          { currentQueryType: 'All', queryResult: [] },
                          this.updateQuery('#InvalidSearch#')
                        );
                      }}
                      updateUserState={this.updateUserState}
                    />
                  );
                })
                : this.state.users.map((user, index) => {
                  return (
                    <OverviewProfile
                      key={index}
                      users={this.state.users}
                      user={user}
                      index={index}
                      token={this.state.authToken}
                      deleteUser={this.deleteUser.bind(this)}
                      updateQuery={() => {
                        this.setState(
                          { currentQueryType: 'All', queryResult: [] },
                          this.updateQuery('#InvalidSearch#')
                        );
                      }}
                      updateUserState={this.updateUserState.bind(this)}
                    />
                  );
                })}
            </tbody>
          </table>
          {/* <UserManagerPageButton users={this.state.count}
            usersPerPage={this.state.usersPerPage}
            page={this.state.page} paginate={this.paginate} /> */}
          <div>
            <nav>
              <ul>
                {renderPageNumbers}
              </ul>
            </nav>
          </div>
        </div>
      </div>
    );
  }
}
