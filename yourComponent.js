async function handleCreateUrl() {
  console.log('Creating URL with:', { url: url.trim(), alias: alias.trim() });
  const response = await createShortUrl(
    url.trim(),
    alias.trim(),
    props.user.token
  );
  console.log('Received response from createShortUrl:', response);
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

// ...existing code...
