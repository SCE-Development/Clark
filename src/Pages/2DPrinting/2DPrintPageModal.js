import React from 'react';
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormGroup,
  Label,
  Input,
  Col,
  Row,
  Spinner
} from 'reactstrap';

export function PrintPageModal(props) {
  const {
    loadPreview,
    displayPagesLeft,
    previewLabels,
    setSides
  } = props;

  return (
    <Modal {...props}>
      <ModalHeader {...props.ModalHeader} >
        Confirm
      </ModalHeader>
      <ModalBody>
        <Row>
          <Col {...props.ModalBody.Col}>
            {loadPreview ? (
              <div className='spinner-wrapper'>
                <Spinner
                  {...props.ModalBody.Spinner}
                />
              </div>
            ) : null}
            <iframe
              title='Preview'
              {...props.ModalBody.iFrame}
            />
          </Col>
          <Col>
            <br />
            <FormGroup>
              <font {...props.ModalBody.pagesLeft}>
                <b>You have {displayPagesLeft} pages left</b>
              </font>
              <legend {...props.ModalBody.legend}>
                {previewLabels.copies}
              </legend>
              <Input {...props.ModalBody.copyInput} />
              <legend {...props.ModalBody.legend}>
                {previewLabels.sides}{' '}
              </legend>
              <FormGroup check>
                <Label check>
                  <Input
                    onChange={e => {
                      setSides('one-sided');
                    }}
                    defaultChecked
                    {...props.ModalBody.sideInput}
                  />
                        Front
                </Label>
              </FormGroup>
              <FormGroup check>
                <Label check>
                  <Input
                    onChange={e => {
                      setSides('two-sided-long-edge');
                    }}
                    {...props.ModalBody.sideInput}
                  />
                      Front & Back
                </Label>
              </FormGroup>
              <legend {...props.ModalBody.legend}>
                {previewLabels.pages}{' '}
              </legend>
              <FormGroup check>
                <Label check>
                  <Input
                    {...props.ModalBody.pagesAll}
                  />
                        All
                </Label>
              </FormGroup>
              <FormGroup check>
                <Label check>
                  <Input {...props.ModalBody.pagesSelect} />
                  <Input {...props.ModalBody.pagesRange} />
                </Label>
              </FormGroup>
            </FormGroup>
            <Label {...props.ModalBody.legend}>
              Note: All prints are black ink only
            </Label>
            <br />
          </Col>
        </Row>
      </ModalBody>
      <ModalFooter>
        <Button {...props.ModalFooter.backButton}> Back </Button>
        <Button {...props.ModalFooter.printButton}> Print! </Button>
      </ModalFooter>
    </Modal>
  );
}

