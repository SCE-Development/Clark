import React, { useState } from 'react';
import {
  Button,
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
  Input,
  InputGroup,
  Col,
  Row,
  InputGroupAddon
} from 'reactstrap';

function SummaryModal(props) {
  const { showSummaryModal, SummaryToggle, handleSummaryEdit } = props;
  const [summary, setSummary] = useState(props.summary);

  function validateFields() {
    return summary !== undefined && summary !== '';
  }

  return (
    <div>
      <Modal isOpen={showSummaryModal} size='lg' toggle={SummaryToggle}>
        <ModalHeader>
          <Col>
            <Row>
              {'Edit Lesson'}
            </Row>
          </Col>
        </ModalHeader>
        <ModalBody>
          <span>
            <span className='text-danger'>* = All fields must be filled</span>
          </span>
          <div>
            <Col>
              <InputGroup className='mb-3 mt-2'>
                <InputGroupAddon addonType='prepend'>
                  Summary*
                </InputGroupAddon>
                <Input
                  type='textarea'
                  onChange={(e) => {
                    setSummary(e.target.value);
                    console.log(summary); //eslint-disable-line
                  }}
                  placeholder='Enter course summary here...'
                  defaultValue={summary}
                />
              </InputGroup>
            </Col>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color='secondary' onClick={SummaryToggle}>
            Cancel
          </Button>
          <Button
            color='primary'
            onClick={() => handleSummaryEdit(summary)}
            disabled={!validateFields()}
          >
            Submit Changes
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default SummaryModal;
