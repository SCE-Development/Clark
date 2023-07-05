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
    { title: '3D Console', url: '/3DConsole' }
  ];

  const handleButtonClick = async () => {
    const users = await getAllUserSubscribedAndVerified();
    const MAILER_API_URL_PROD = process.env.MAILER_API_URL_PROD
      || 'http://localhost:8082/cloudapi';
    let status;
    await axios
      .post(`${MAILER_API_URL_PROD}/Mailer/sendUnsubscribeEmail`, {users})
      .then(res =>{
        status = res.data;
      })
      .catch(err => {
        status = err.data;
      });
    return status;
  };

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
        <Button onClick={handleButtonClick}>
          Send Unsubscribe Email to All
        </Button>
      </body>
    </div>
  );
}

export default AdminDashboard;
