import React from 'react';
import './AdminDashboard.css';
import Header from '../../../Components/Header/Header';
import InfoCard from '../MemberView/InfoCard';
import { Link } from 'react-router-dom';

function AdminDashboard() {
  const fields = [
    { title: 'User Manager', url: '/user-manager' },
    { title: 'Event Manager', url: '/event-manager' },
    { title: 'LED Sign', url: '/led-sign' },
    { title: '3D Console', url: '/3DConsole' },
    { title: 'Speakers', url: '/speakers'},
    { title: 'URL Shortener', url: '/short'},
  ];

  return (
    <div className='flexbox-container'>
      <body className='admin-dashboard-bg'>
        <Header title='Admin Dashboard'></Header>
        <div className='block'></div>
        {fields.map((elem, ind) => {
          return (
            <Link to={elem.url} key={ind} id='admin-box'
              style={{ textDecoration: 'none' }}>
              <InfoCard
                key={ind}
                field={elem}
              />
            </Link>
          );
        })}
      </body>
    </div>
  );
}

export default AdminDashboard;
