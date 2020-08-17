import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './3D-console.css';
import {
  Button,
  ButtonGroup,
  Card,
  CardTitle,
  CardBody,
  Collapse,
  FormGroup,
  Row,
  Col
} from 'reactstrap';

function RequestForm(props) {
  const { item } = props;

  const printColumnInfo = [
    { sm: '4', title: `Print Link: ${item.projectLink}` },
    { sm: '3', title: `Print Color: ${item.color}` },
    { sm: '4', title: `Comments: ${item.projectComments}` }
  ];

  const consoleInfo = [
    { lgSize: '3', title: 'E-mail/Contact:', value: item.projectContact },
    { lgSize: '3', title: 'Requested Date:', value: item.date },
    { lgSize: '2', title: 'Progress:', value: item.progress }
  ];

  const consoleButtons = [
    {
      color: 'primary',
      value: 'Reject',
      handleUpdates: e => {
        props.handleUpdateProgress(item, e);
      }
    },
    {
      color: 'info',
      value: 'In Progress',
      handleUpdates: e => {
        props.handleUpdateProgress(item, e);
      }
    },
    {
      color: 'success',
      value: 'Completed',
      handleUpdates: e => {
        props.handleUpdateProgress(item, e);
      }
    },
    {
      color: 'danger',
      value: 'Delete',
      handleUpdates: e => {
        props.handleDelete(item);
      }
    }
  ];

  return (
    <FormGroup>
      <Card className='request-card' body onClick={props.handleToggle} inverse>
        <CardTitle>{item.name + '\''}s Request</CardTitle>
        <div>
          <Row>
            {consoleInfo.map(item => {
              return (
                <Col
                  md='12'
                  lg={item.lgSize}
                  className='request-label-1'
                  key={item.title}
                >
                  {item.title}
                </Col>
              );
            })}
          </Row>

          <Row>
            {consoleInfo.map((item, itr) => {
              return (
                <Col md='12' lg={item.lgSize} key={itr}>
                  <div className='request-label-2'>{item.title}</div>
                  {item.value}
                </Col>
              );
            })}
            <Col md='12' lg='4' id='request-buttons'>
              <ButtonGroup>
                {consoleButtons.map(item => {
                  return (
                    <Button
                      key={item.value}
                      size='sm'
                      color={item.color}
                      value={item.value}
                      onClick={item.handleUpdates}
                    >
                      {item.value}
                    </Button>
                  );
                })}
              </ButtonGroup>
            </Col>
          </Row>
        </div>
      </Card>

      <Collapse isOpen={props.collapse}>
        <Card className = 'request-info'>
          <CardBody>
            <Row>
              {printColumnInfo.map((columnInfo, index) => {
                return (
                  <Col key={index} xs='6' sm={columnInfo.sm}>
                    {columnInfo.title}
                  </Col>
                );
              })}
            </Row>
          </CardBody>
        </Card>
      </Collapse>
    </FormGroup>
  );
}

export default RequestForm;
