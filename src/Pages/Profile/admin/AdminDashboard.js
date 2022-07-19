import React from 'react';
import './AdminDashboard.css';
import Header from '../../../Components/Header/Header';
import InfoCard from '../MemberView/InfoCard';
import { Link } from 'react-router-dom';

function AdminDashboard() {
  const fields = [
    { title: 'User Manager', value: '', url: '/user-manager' },
    { title: 'Event Manager', value: '', url: '/event-manager' },
    { title: 'LED Sign', value: '', url: '/led-sign' },
    { title: '3D Console', value: '', url: '/3DConsole' }
  ];
  return (
    <div className='flexbox-container'>
      <body className='admin-dashboard-bg'>
        <Header title='Admin Dashboard'></Header>
        <div className='block'></div>
        {fields.map((elem, ind) => {
          return (
            <Link to={elem.url} id='admin-box'
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
