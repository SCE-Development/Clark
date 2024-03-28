import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

export default function DessertEditModal({ isOpen, toggle, dessert, onSave, onCancel }) {
  const handleSave = () => {
    onSave(); 
    toggle(); 
  };

  const handleCancel = () => {
    onCancel(); 
    toggle();
  };

  console.log(isOpen);
  
  return (
    <div>
      <Modal isOpen={isOpen} toggle={toggle}>
        <ModalHeader toggle={toggle}>Edit Dessert</ModalHeader>
        <ModalBody>
          {/* edit form inputs here */}
          Hello pooping
        </ModalBody>
        <ModalFooter>
            <Button color="primary" onClick={handleSave}>
            Save Changes
          </Button>{' '}
          <Button color="secondary" onClick={handleCancel}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
