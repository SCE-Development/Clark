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

export default class OverviewBoard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      queryResult: [],
      toggle: false,
      currentQueryType: 'All',
      queryTypes: ['All', 'Pending', 'Officer', 'Admin', 'Alumni']
    };
    this.headerProps = {
      title: 'User Manager'
    };
  }

  componentDidMount() {
    console.log('wats up', this.props)
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

  componentDidUpdate() {
    console.log('componentDidUpdate', this.props);
    totalUsers(location.search)
      .then(res => console.log(res));
  }

  async callDatabase() {
    const apiResponse = await getAllUsers(this.state.authToken);
    // console.log(apiResponse);

    if (!apiResponse.error) this.setState({ users: apiResponse.responseData });
  }

  updateUserState(users) {
    this.setState({ users });
  }

  updateQuery(value) {
    // taking care of empty values
    value = typeof value === 'undefined' ? '' : value;
    value = value.trim().toLowerCase();

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

  render() {
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
              this.props.history.push("/user-manager", { state: 'sample data'}); 
              this.updateQuery(event.target.value);
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
        </div>
      </div>
    );
  }
}
