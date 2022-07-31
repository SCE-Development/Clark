import React from 'react';
import './footerModal.css';

const FooterModal = (props) => {
  return (
    <div className="footer-modal-box">
      <div className="box">
        <span className="close-icon" onClick={props.handleClose}>
          x
        </span>
        <div className="footer-modal-text">
          <h1>Contact Us</h1>
          <p>
            If you have any questions, please contact us:
            <ul>
              <li>
                <a href="mailto:asksce@gmail.com">General Inquiry</a>
              </li>
              <li>
                <a href="mailto:sce.sjsu@gmail.com">President</a>
              </li>
              <li>
                <a href="mailto:sce.sjsu@gmail.com">Vice-President</a>
              </li>
              <li>
                <a href="mailto:pr.sce.sjsu@gmail.com">Public Relations</a>
              </li>
            </ul>
          </p>
        </div>
      </div>
    </div>
  );
};

export default FooterModal;
