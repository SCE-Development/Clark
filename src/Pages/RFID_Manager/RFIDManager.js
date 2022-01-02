import React, { useState, useEffect } from 'react';
import {
  createNewRFID,
  readNewRFID,
  getAllRFIDs,
  deleteRFID
} from '../../APIFunctions/RFID';
import './rfid-page.css';
import { Button, Container } from 'reactstrap';
import RFIDManagerModal from './RFIDManagerModal.js';
import { RFIDModalState } from '../../Enums';
import RFIDCard from './RFIDCard';
import Header from '../../Components/Header/Header';

export default function RFIDManager(props) {
  const [modal, setModal] = useState(false);
  const [RFID, setRFID] = useState();
  const [modalState, setModalState] = useState(RFIDModalState.SUBMIT);
  const [RFIDList, setRFIDList] = useState([]);
  const headerProps = {
    title: 'RFID Manager'
  };

  async function populateRFIDList() {
    const RFIDData = await getAllRFIDs();
    if (!RFIDData.error) setRFIDList(RFIDData.responseData);
  }

  useEffect(() => {
    populateRFIDList();
  }, []);

  function toggle() {
    setModal(!modal);
  }

  function toggleDeleteRFID(RFID) {
    setModalState(RFIDModalState.DELETE);
    setRFID(RFID);
    toggle();
  }

  function toggleNewRFID() {
    setRFID();
    setModalState(RFIDModalState.SUBMIT);
    setModal(!modal);
  }

  async function handleSubmit(RFID) {
    if (modalState === RFIDModalState.SUBMIT) {
      const res = await createNewRFID(RFID, props.user.token);
      if (res.error === false) {
        const readNewRFIDRes = await readNewRFID();
        if (readNewRFIDRes.error === false) {
          alert('Cannot add RFID!');
        } else {
          alert('Scan RFID card then press OK');
          window.location.reload();
        }
      } else {
        alert('Try Again!');
        window.location.reload();
      }
    } else if (modalState === RFIDModalState.DELETE) {
      await deleteRFID(RFID, props.user.token);
    }
  }

  return (
    <React.Fragment>
      <Header {...headerProps} />
      <Container className='rfid-list'>
        <Button className='create-rfid' onClick={toggleNewRFID}>
          New RFID
        </Button>
        {modal && (
          <RFIDManagerModal
            modal={modal}
            toggle={toggle}
            handleDelete={RFID => {
              deleteRFID(RFID, props.user.token);
              window.location.reload();
            }}
            handleSubmit={handleSubmit}
            modalState={modalState}
            populateRFIDList={populateRFIDList}
            token={props.user.token}
            {...RFID}
          />
        )}
        {RFIDList.length ? (
          <h4>Click on an RFID below to delete it</h4>
        ) : null}
        {RFIDList.length ? (
          RFIDList.reverse().map((RFID, index) => {
            return (
              <React.Fragment key={index}>
                <RFIDCard
                  isRFIDManager = {true}
                  handleClick={() => toggleDeleteRFID(RFID)}
                  {...RFID}
                />
              </React.Fragment>
            );
          })
        ) : (
          <h1 className='empty-title'>No RFIDs yet!</h1>
        )}
      </Container>
    </React.Fragment>
  );
}
