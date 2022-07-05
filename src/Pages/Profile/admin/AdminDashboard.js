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
    <div>
      <Header title='Admin Dashboard'></Header>
      {fields.map((elem, ind) => {
        return (
          <Link to={elem.url} id='admin-box' style={{ textDecoration: 'none' }}>
            <InfoCard
              key={ind}
              field={elem}
            />
          </Link>
        );
      })}
    </div>
  );
}

export default AdminDashboard;
