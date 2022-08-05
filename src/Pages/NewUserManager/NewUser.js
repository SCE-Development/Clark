import './UserManager.css';
import { React, useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Paginate } from './Paginate';
import { Users } from './Users';
import { Button, DropdownToggle, DropdownMenu } from 'reactstrap';
import { ButtonDropdown, DropdownItem } from 'reactstrap';
import Header from '../../Components/Header/Header';
import OverviewProfile from '../Overview/OverviewProfile';
// import 'bootstrap/dist/css/bootstrap.min.css';

export default function NewUser() {

  const usersPerPage = 10;

  const [data, setData] = useState();
  const [allData, setAllData] = useState(null);

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams('?page=1&u=' +
    `${usersPerPage}&sort=firstName&filter=All`);
  const [searching, setSearching] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function getData() {
      let page = searchParams.get('page') || 1;
      let userSearch = searchParams.get('search') || '';
      let sort = searchParams.get('sort') || 'firstName';
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
    let sort = searchParams.get('sort') || 'firstName';
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
    let sortGang = searchParams.get('sort') || 'firstName';
    navigate(`?page=1&u${usersPerPage}&search=${userSearchGang}&sort=` +
      `${sortGang}&filter=${filter}`);
  }

  return (
    <div className="App">
      <Header title='User Manager' />
      <br/>
      <form>
        <label className="search-row">
          <ButtonDropdown>
            <DropdownToggle caret variant="secondary" id="dropdown-basic">
              Filter: {searchParams.get('filter')}
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem onClick={() => {
                // setFilter('All')
                filterBy('All');
              }}>All</DropdownItem>
              <DropdownItem onClick={() => {
                // setFilter('Top G')
                filterBy('Top G');
              }}>Top G</DropdownItem>
              <DropdownItem onClick={() => {
                // setFilter('Papi')
                filterBy('Papi');
              }}>Papi</DropdownItem>
              <DropdownItem onClick={() => {
                // setFilter('Slave')
                filterBy('Slave');
              }}>Slave</DropdownItem>
            </DropdownMenu>
          </ButtonDropdown>
          <input placeholder='Search' id="search-bar" onChange={(e) => {
            setSearch(e.target.value);
          }
          }></input>
        </label>
        {/* search submit, user clicks this when they wanna search something */}
        <Button onClick={() => {
          if (search.length > 0) {
            setSearching(true);
            navigate(`?page=1&u=${usersPerPage}&search=${search}&sort=` +
            `${searchParams.get('sort')}&filter=${searchParams.get('filter')}`);
          } else {
            setSearching(false);
            navigate(`?page=${searchParams.get('page')}&u=${usersPerPage}&` +
              `sort=${searchParams.get('sort')}&` +
              `filter=${searchParams.get('filter')}`);
          }
        }}>Submit</Button>
      </form>
      <ButtonDropdown>
        <DropdownToggle variant="success" id="dropdown-basic">
          Sort By: {searchParams.get('sort')}
        </DropdownToggle>
        <DropdownMenu>
          <DropdownItem onClick={() => {
            sortBy('firstName');
          }}>Name</DropdownItem>
          <DropdownItem onClick={() => {
            sortBy('wins');
          }}>Wins</DropdownItem>
          <DropdownItem onClick={() => {
            sortBy('type');
          }}>Type</DropdownItem>
        </DropdownMenu>
      </ButtonDropdown>
      {allData &&
        (<div>
          <Users data={data} />
          <Paginate usersPerPage={usersPerPage} totalUsers={allData.length}
            paginate={paginate} searchParams={searchParams}
            searching={searching} />
        </div>)
      }
    </div>
  );
}

