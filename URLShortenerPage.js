import React, { useEffect, useState } from 'react';
import { getAllUrls, createUrl, deleteUrl } from '../../APIFunctions/Cleezy';
import { trashcanSymbol } from '../Overview/SVG';
import ConfirmationModal from '../../Components/DecisionModal/ConfirmationModal.js';

export default function URLShortenerPage(props) {
  const [allUrls, setAllUrls] = useState([]);
  const [url, setUrl] = useState('');
  const [alias, setAlias] = useState('');
  const [aliasTaken, setAliasTaken] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [total, setTotal] = useState(0);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorAlertMessage, setErrorAlertMessage] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const response = await getAllUrls(props.user.token);
      setAllUrls(response.responseData);
      setTotal(response.responseData.length);
    }
    fetchData();
  }, [props.user.token]);

  async function handleCreateUrl() {
    console.log('Creating URL with:', { url: url.trim(), alias: alias.trim() });
    const response = await createUrl(
      url.trim(),
      alias.trim(),
      props.user.token
    );
    console.log('Received response from createUrl:', response);
    if (!response.error) {
      setAllUrls([...allUrls, response.responseData]);
      setAliasTaken(false);
      setUrl('');
      setAlias('');
      setShowUrlInput(false);
      setTotal(total + 1);
      setSuccessMessage(`Successfully created shortened link ${response.responseData.link}`);
      setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
      return true;
    } else {
      setAliasTaken(true);
      setErrorAlertMessage('That alias is taken!');
      return false;
    }
  }

  async function handleDeleteUrl(id) {
    const response = await deleteUrl(id, props.user.token);
    if (!response.error) {
      setAllUrls(allUrls.filter((url) => url._id !== id));
      setTotal(total - 1);
    }
  }

  return (
    <div>
      {/* ...existing JSX code... */}
    </div>
  );
}
