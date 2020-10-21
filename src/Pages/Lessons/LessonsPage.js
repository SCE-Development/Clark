import React, { useState } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

function LessonsPage(props) {
  const { lessons } = props.location.state;
  const [mdContent, setMdContent] = useState();

  async function getMDContent(URL) {
    axios.get(URL)
      .then(resp => {
        console.log(resp.data)
        setMdContent(resp.data)
      })
      .catch(err => alert('Sorry, the selected lesson can\'t be found'));
  }

  return (
    <div>
      <div className='md-content'>
        {mdContent ? 
          <p>
            <ReactMarkdown source={mdContent} />
          </p>
          : 
          <p>Click a lesson and learn more!</p>}
      </div>
      <div className='lessons-list'>
        {lessons[0].data.map((article, index) => (
          <div key={index}>
            <a onClick={() => getMDContent(article.link)}>{article.name}</a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LessonsPage;
