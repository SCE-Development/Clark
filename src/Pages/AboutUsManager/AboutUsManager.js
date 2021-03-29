import React, { useState, useEffect} from 'react';
import {
  getAllOfficers,
  createOfficer,
  editOfficer,
  deleteOfficer
} from '../../APIFunctions/OfficerManager';
import AboutUsCard from '../AboutUs/AboutUsCard.js';
import AboutUsCircle from '../AboutUs/AboutUsCircle.js';
import { officerModalState } from '../../Enums';
import AboutUsManagerModal from './AboutUsManagerModal.js';
import { Button } from 'reactstrap';
import Header from '../../Components/Header/Header';
import './AboutUsManager.css';
export default function AboutUsManager(props){
  const [modal, setModal] = useState(false);
  const [officer, setOfficer] = useState();
  const [modalState, setModalState] = useState(officerModalState.SUBMIT);
  const [officers, setOfficers] = useState([]);
  const headerProps = {
    title: 'About Us Manager'
  };


  async function populateOfficers(){
    const officerData = await getAllOfficers();
    if(!officerData.error) setOfficers(officerData.responseData);
  }

  useEffect(() => {
    populateOfficers();
  }, []);

  function toggle(){
    setModal(!modal);
  }

  function toggleEditOfficer(officer) {
    setModalState(officerModalState.EDIT);
    setOfficer(officer);
    toggle();
  }

  function toggleCreateOfficer() {
    setOfficer();
    setModalState(officerModalState.SUBMIT);
    setModal(!modal);
  }

  async function handleSubmit(officer) {
    if (modalState === officerModalState.SUBMIT) {
      await createOfficer(officer, props.user.token);
    } else if(modalState === officerModalState.EDIT) {
      await editOfficer(officer, props.user.token);
    }
  }

  return (
    <>
      <Header {...headerProps} />
      <main className="officer-body">
        <section className="exec-container">
          <Button onClick={toggleCreateOfficer} className="create-officer">
                      Add Officer +
          </Button>
          {modal && (<AboutUsManagerModal
            modal={modal}
            toggle={toggle}
            handleDelete={() => deleteOfficer(officer, props.user.token)}
            handleSubmit={handleSubmit}
            modalState={modalState}
            populateOfficers={populateOfficers}
            token={props.user.token}
            {...officer}
          />)}
          <h2>Executive Team</h2>
          <div className="grid-container">
            {officers.length ? (officers.map((officer, i)=> {
              if(officer.team === 'executive'){
                return(
                  <AboutUsCard
                    handleClick={() => toggleEditOfficer(officer)}
                    info={officer}
                    key={i}/>
                );
              } return null;
            })): (
              <span>No executives yet!</span>
            )}
          </div>
        </section>
        <section className="officer-container">
          <h2>Meet Our Team</h2>
          <div className="grid-container-circle">
            {officers.length ? (officers.map((officer, i) => {
              if(officer.team === 'officers'){
                return(
                  <AboutUsCircle
                    handleClick={() => toggleEditOfficer(officer)}
                    info={officer}
                    key={i}/>
                );
              } return null;
            })): (
              <span>No officers yet!</span>
            )}
          </div>
        </section>
      </main>
    </>
  );
}

