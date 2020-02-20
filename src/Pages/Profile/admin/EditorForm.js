import React from 'react'
import {
  Button,
  Row,
  Col,
  FormGroup,
  Form,
  Input,
  Modal,
  Label,
  ModalBody,
  ModalFooter
} from 'reactstrap'
const enums = require('../../../Enums.js')

export default function EditForm (props) {
  return (
    <Row>
      <Col>
        <div>
          <Button
            color='primary'
            style={{
              position: 'relative',
              left: '80%'
            }}
            onClick={() => {
              props.handleToggle()
            }}
          >
            Edit
          </Button>
        </div>

        <Modal isOpen={props.toggle} toggle={() => props.handleToggle()}>
          <ModalBody>
            <Form>
              {props.formGroups.map((group, index) => (
                <FormGroup key={index}>
                  <Label>{group.label}</Label>
                  <Input
                    type={group.type || 'email'}
                    name={group.type}
                    placeholder={group.placeholder}
                    onChange={group.handleChange}
                  />
                </FormGroup>
              ))}
              Change expiration date to
              <select
                onChange={event => {
                  props.setNumberOfSemestersToSignUpFor(event.target.value)
                }}
              >
                {props.membership.map((x, ind) => (
                  <option key={ind} value={x.value}>
                    {x.name}
                  </option>
                ))}
              </select>
              {/* <Button
                type='button'
                onClick={() => {
                  props.setPagesPrinted(0)
                }}
                color='info'
                style={{ marginTop: '5px' }}
              >
                Reset Pages!
              </Button> */}
              <FormGroup check inline style={{ marginTop: '5px' }}>
                <Label check style={{ marginRight: '5px' }} id='resetPages2'>
                  Reset Pages!
                </Label>
                <Input
                  type='checkbox'
                  id='resetPages'
                  onClick={() => {
                    console.log(document.getElementById('resetPages').value)
                    if (
                      parseInt(document.getElementById('resetPages').value) ===
                      1
                    ) {
                      document
                        .getElementById('resetPages')
                        .setAttribute('value', 0)
                    } else {
                      document
                        .getElementById('resetPages')
                        .setAttribute('value', 1)
                    }
                  }}
                />
              </FormGroup>
              <FormGroup tag='fieldset'>
                <legend>Membership Status</legend>
                {Object.values(enums.membershipState).map(
                  (membership, index) => (
                    <FormGroup check key={index}>
                      <Label check>
                        <Input
                          type='radio'
                          name='radio1'
                          value={membership}
                          onChange={() => {
                            props.setuserMembership(membership)
                          }}
                        />
                        {enums.membershipStateToString(membership)}
                      </Label>
                    </FormGroup>
                  )
                )}
              </FormGroup>
            </Form>
          </ModalBody>

          <ModalFooter>
            <Button
              color='primary'
              onClick={() => {
                if (
                  parseInt(document.getElementById('resetPages').value) === 1
                ) {
                  props.setPagesPrinted(0)
                }
                props.handleSubmissionToggle()
              }}
            >
              Submit
            </Button>
            <Button
              color='secondary'
              onClick={() => {
                props.handleToggle()
              }}
            >
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </Col>
    </Row>
  )
}
