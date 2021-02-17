import React, { Component } from 'react';
import './Gallery.css';
import CarouselSlider from './CarouselSlider.js';
import { Modal, ModalBody, Container } from 'reactstrap';
import {
  getFileFromS3,
  getListOfFiles
} from '../../APIFunctions/S3Bucket.js';
import carouselImages from './CarouselPictures.js';

class Gallery extends Component {

  constructor(props) {
    super(props);
  }

  state = {
    picList: [],
    isOpen: false,
    carouselPics: carouselImages,
    modalImage: ''
  }

  async getImage(object, index) {
    const res = await getFileFromS3(object.Key);
    if (res.error === true) {
      alert('getFile error at index: ' + index);
      return '';
    }
    return res.responseData.url.url;
  }

  async componentDidMount() {
    const prefix = '';
    const getListRes = await getListOfFiles(prefix);
    if (getListRes.error === false) {
      let picMap = [];
      getListRes.responseData.list.Contents.map((pic, index) => {
        this.getImage(pic, index)
          .then((picStr) => {
            picMap.push(picStr);
            this.setState({
              picList: picMap
            });
          });
      });
    }
  }

  toggleModal(pic) {
    this.setState(prevState => ({
      isOpen: !prevState.isOpen,
      modalImage: pic
    }));
  }

  render() {
    return (
      <div className="section">
        <Container className="container">
          <div className="wrapper">
            <div className="rectangle">
              <h2 className="header">Gallery</h2>
            </div>
            <CarouselSlider carouselPics={this.state.carouselPics} />
            <div className="arrow-down"></div>
          </div>
          <div className="gallery">
            {
              this.state.picList.map((pic, index) => {
                return (
                  <img src={pic} className="singleImage"
                    onClick={() => this.toggleModal(pic)}
                    key={pic.id} id={index} />
                );
              })
            }
            <Modal isOpen={this.state.isOpen}
              toggle={() => this.toggleModal(this.state.modalImage)} size="lg"
              aria-labelledby="contained-modal-title-vcenter" centered>
              <ModalBody className="modal-body">
                <img src={this.state.modalImage} className="modalImage" />
              </ModalBody>
            </Modal>
          </div>
        </Container>
      </div>
    );
  }
}

export default Gallery;
