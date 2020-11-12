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
  PopoverHeader
} from 'reactstrap';
import { NavLink } from 'react-router-dom';

function CourseCard(props) {
  const [showPopOver, setShowPopOver] = useState(false);
  const {
    cardNum,
    imageURL,
    title,
    author,
    description,
    handleClick,
    lessons
  } = props;

  return (
    <React.Fragment>
      <NavLink
        to={{
          pathname: '/courses/lesson',
          state: { lessons }
        }}
        style={{
          color:'black',
          textDecoration:'none'
        }}

      >
        <Card
          id={`card${cardNum}`}
          className='shadow h-100'
          width='3em'
          onClick={() => {
            if(handleClick) {
              handleClick();
            }
          }}
          onMouseEnter={() => setShowPopOver(true)}
          onMouseLeave={() => setShowPopOver(false)}
          onMouseOver={() => setShowPopOver(true)}
        >
          <CardImg top height='50%'src={imageURL} alt='Card image' />
          <CardBody className='pb-0'>
            <CardTitle><h2><b>{title}</b></h2></CardTitle>
            <CardSubtitle>By: {author}</CardSubtitle>
            <CardText>{description}</CardText>
          </CardBody>
        </Card>
      </NavLink>
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
          {lessons[0].data.length > 0 ? (
            <React.Fragment>
              <h6>This course contains the following lessons:</h6>
              {lessons[0].data.map((article, index) => {
                return (
                  <h6 key={index}>
                    ✔️ {article.name}
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
