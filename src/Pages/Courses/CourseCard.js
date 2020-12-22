import React, { useState } from 'react';
import './courses-page.css';
import {
  Card,
  CardText,
  CardImg,
  CardBody,
  CardSubtitle,
  CardTitle,
  Popover,
  PopoverBody,
  PopoverHeader,
  Button
} from 'reactstrap';

function CourseCard(props) {
  const [showPopOver, setShowPopOver] = useState(false);
  const {
    cardNum,
    imageURL,
    title,
    author,
    description,
    handleClick,
    lessons,
    isCourseManager,
    handleEdit
  } = props;

  return (
    <React.Fragment>
      <Card
        id={`card${cardNum}`}
        className='shadow h-100'
        onClick={handleClick}
        onMouseEnter={() => setShowPopOver(true)}
        onMouseLeave={() => setShowPopOver(false)}
        onMouseOver={() => setShowPopOver(true)}
      >
        {isCourseManager &&
          <button
            id='edit'
            className='edit-button shadow-none'
            onClick={handleEdit}
          >
            Edit course
          </button>}
        <CardImg
          top
          src={imageURL}
          alt='Card image'
        />
        <CardBody>
          <CardTitle><h2><b>{title}</b></h2></CardTitle>
          <CardSubtitle>By: {author}</CardSubtitle>
          <CardText>{description}</CardText>
        </CardBody>
      </Card>
      <Popover
        placement='right'
        fade={true}
        isOpen={showPopOver}
        target={`card${cardNum}`}
      >
        <PopoverHeader>
          <div className='mb-0'>
            <h3>{title}</h3>
          </div>
        </PopoverHeader>
        <PopoverBody>
          {lessons.length > 0 ? (
            <React.Fragment>
              <h6>This course contains the following lessons:</h6>
              {lessons.map((article, index) => {
                return (
                  <h6 key={index}>
                    ✔️ {article.title}
                  </h6>
                );
              })}
            </React.Fragment>
          ) : <h6>This course currently doesn't have lessons</h6>}
        </PopoverBody>
      </Popover>
    </React.Fragment>
  );
}

export default CourseCard;
