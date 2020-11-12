import React, { useState } from 'react';
import axios from 'axios';
import marked from 'marked';

function LessonsPage(props) {
  const { lessons } = props.location.state;
  const [mdContent, setMdContent] = useState();

  async function getMDContent(URL) {
    axios.get(URL)
      .then(resp => setMdContent(resp.data))
      .catch(err => alert('Sorry, the selected lesson can\'t be found'));
  }

  return (
    <div>
      <div className='md-content'>
        {mdContent ?
          <p
            dangerouslySetInnerHTML={{__html:marked.parse(mdContent)}}
          >
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
