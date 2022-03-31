import React from 'react';
import RequestForm from './RequestForm';
import 'bootstrap/dist/css/bootstrap.min.css';
import './3D-console.css';
import { Form, Container } from 'reactstrap';
import {
  getAll3DPrintRequests,
  delete3DPrintRequest,
  update3DPrintRequestProgress
} from '../../APIFunctions/3DPrinting';
import Header from '../../Components/Header/Header';
import ConfirmationModal from
  '../../Components/DecisionModal/ConfirmationModal';

export default class PrintConsole3D extends React.Component {
  constructor(props) {
    super(props);
    this.handleToggle = this.handleToggle.bind(this);
    this.state = {
      collapse: true,
      data: [],
      key: '',
      search: '',
      modalOpen: false,
      itemToDelete: null
    };
    this.headerProps = {
      title: '3D Console'
    };
  }

  componentDidMount() {
    this.setState({
      isLoggedIn: this.props.authenticated,
      authToken: this.props.user.token
    });
    if (window.localStorage) this.callDatabase();
  }

  // Update card's collapse option
  handleToggle() {
    this.setState({ collapse: true });
  }

  // Getting all data in DB
  async callDatabase() {
    const data = await getAll3DPrintRequests();
    if (!data.error) {
      this.setState({ data: data.responseData });
    }
  }

  handleConfirmationModal = async item => {
    this.setState({
      modalOpen: true,
      itemToDelete: item
    });
  };

  toggleModal = () => {
    this.setState({
      modalOpen: !this.state.modalOpen
    });
  };

  delete3dPrintRequest = async requestToDelete => {
    this.setState({
      modalOpen: false
    });
    const deleteResponse = await delete3DPrintRequest(
      requestToDelete,
      this.state.authToken
    );
    if (!deleteResponse.error) {
      this.setState({
        data: this.state.data.filter(
          request => !request._id.includes(requestToDelete._id)
        )
      });
    }
  };

  /*
  Parameters: Json Object that will be updated and an onClick event with a value
  Search for object in db using its name and date
  Set new progress = event value
  */
  handleUpdateProgress = async (requestToUpdate, event) => {
    const newProgress = event.target.value;
    if (newProgress === requestToUpdate.progress) return;
    const updateRequest = {
      progress: newProgress,
      email: requestToUpdate.email,
      date: requestToUpdate.date
    };
    const requestProgressResult = await update3DPrintRequestProgress(
      updateRequest,
      this.state.authToken
    );
    if (!requestProgressResult.error) {
      let updateIndex = this.state.data.findIndex(
        request => request._id === requestToUpdate._id
      );
      const newData = [...this.state.data];
      newData[updateIndex].progress = newProgress;
      this.setState({ data: newData });
    }
  };

  search() {
    const search = this.state.search.trim().toLowerCase();
    return search !== null || search !== ''
      ? this.state.data.filter(data => data.name.toLowerCase().includes(search))
      : this.state.data;
  }

  render() {
    return (
      <div>
        <Header {...this.headerProps} />
        <Container>
          <Form>
            <br />
          Search:
            <input
              placeholder='By Name'
              style={{
                marginBottom: '5px',
                marginLeft: '5px'
              }}
              onChange={e => {
                this.setState({ search: e.target.value });
              }}
            />
            <br />
            {this.search().map((item, key) => (
              <RequestForm
                item={item}
                key={key}
                handleToggle={this.handleToggle}
                handleUpdateProgress={this.handleUpdateProgress}
                handleDelete={this.handleConfirmationModal}
                collapse={this.state.collapse}
              />
            ))}
            <ConfirmationModal
              headerText = 'Delete 3D Print Request'
              bodyText = {'Are you sure you want to ' +
                'delete this print request?'}
              handleConfirmation = {() =>
                this.delete3dPrintRequest(this.state.itemToDelete)}
              open = {this.state.modalOpen}
              toggle = {this.toggleModal}/>
          </Form>
        </Container>
      </div>
    );
  }
}
