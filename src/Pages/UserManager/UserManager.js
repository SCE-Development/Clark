import './UserManager.css';
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Paginate } from './Paginate';
import { Users } from './Users';
import { Button, Table } from 'reactstrap';
import Header from '../../Components/Header/Header';
import OverviewProfile from '../Overview/OverviewProfile';

import Dropdown from './Dropdown';

export default function User() {

  const usersPerPage = 5;

  const [data, setData] = useState();
  const [allData, setAllData] = useState(null);

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams('?page=1&u=' +
    `${usersPerPage}&sort=First%20Name&filter=All`);
  const [searching, setSearching] = useState(false);
  const [search, setSearch] = useState('');

  const [
    FilterDropdownOpen,
    setFilterDropdownOpen
  ] = React.useState('All');
  const [
    SortDropdownOpen,
    setSortDropdownOpen
  ] = React.useState('First Name');

  const filterOptions = ['All', 'Admin', 'Pending'];
  const sortOptions = [
    'First Name',
    'Last Name',
    'Join Date',
    'Membership'
  ];

  useEffect(() => {
    async function getData() {
      let page = searchParams.get('page') || 1;
      let userSearch = searchParams.get('search') || '';
      let sort = searchParams.get('sort') || 'First Name';
      let filter = searchParams.get('filter') || 'All';

      await fetch(`api/User/davidUsers/?page=${page}&u=${usersPerPage}` +
        `&search=${userSearch}&sort=${sort}&filter=${filter}`)
        .then(res => res.json())
        .then(data => {
          setData(data.currentUsers);
          setAllData(data.allUsers);
        })
        .catch(err => {
          throw err;
        });
    }
    getData();
  }, [searchParams]);

  function paginate(page, searching) {

    let userSearch = searchParams.get('search') || '';
    let sort = searchParams.get('sort') || 'First Name';
    let filter = searchParams.get('filter') || 'All';

    if (searching) {
      navigate(`?page=${page}&u=${usersPerPage}&search=` +
        `${userSearch}&sort=${sort}&filter=${filter}`);
    } else {
      navigate(`?page=${page}&u=${usersPerPage}&sort=${sort}&filter=${filter}`);
    }
  }

  function sortBy(sort) {
    let userSearchGang = searchParams.get('search') || '';
    let filterGang = searchParams.get('filter') || 'All';
    navigate(`?page=1&u${usersPerPage}&search=${userSearchGang}&sort=` +
      `${sort}&filter=${filterGang}`);
  }
  function filterBy(filter) {
    let userSearchGang = searchParams.get('search') || '';
    let sortGang = searchParams.get('sort') || 'First Name';
    navigate(`?page=1&u${usersPerPage}&search=${userSearchGang}&sort=` +
      `${sortGang}&filter=${filter}`);
  }

  return (
    <div className="App user-manager-bg">
      <Header title='User Manager' />
      <br />
      <form>
        <label className="search-row">
          <input placeholder='Search' id="search-bar" onChange={(e) => {
            setSearch(e.target.value);
          }
          }></input>
        </label>
        <Button id='user-manager-submit' onClick={() => {
          if (search.length > 0) {
            setSearching(true);
            navigate(`?page=1&u=${usersPerPage}&search=${search}&sort=` +
              `${searchParams.get('sort')}` +
              `&filter=${searchParams.get('filter')}`);
          } else {
            setSearching(false);
            navigate(`?page=${searchParams.get('page')}&u=${usersPerPage}&` +
              `sort=${searchParams.get('sort')}&` +
              `filter=${searchParams.get('filter')}`);
          }
        }}>Submit</Button>
        <br />
        <div className='toolbar'>
          <Dropdown options={filterOptions}
            selected={searchParams.get('filter')}
            setSelected={setFilterDropdownOpen}
            filterBy={filterBy}
            title='Filter By: ' />
          <Dropdown options={sortOptions}
            selected={searchParams.get('sort')}
            setSelected={setSortDropdownOpen}
            filterBy={sortBy}
            title='Sort By: ' />
        </div>
      </form>
      {allData &&
        (<div id='user-manager-table'>
          <Table dark>
            <thead>
              <tr>
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
              {data.map((user, id) => (
                <Users user={user} key={id}/>
              ))}
            </thead>
          </Table>
          <Paginate usersPerPage={usersPerPage} totalUsers={allData.length}
            paginate={paginate} searchParams={searchParams}
            searching={searching} />
        </div>)
      }
    </div>
  );
}

