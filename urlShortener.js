const axios = require('axios');

async function createShortUrl(url, alias) {
  try {
    console.log('Sending request with data:', { url, alias: alias || null });
    const response = await axios.post('http://localhost:8000/create_url', {
      url: url,
      alias: alias || null // Ensure alias is either a user-provided value or null
    });
    console.log('Received response:', response.data);
    return { error: false, responseData: response.data };
  } catch (error) {
    if (error.response) {
      console.error('Received error response:', error.response.data);
      if (error.response.status === 409) {
        console.error('Alias already exists. Please choose a different alias.');
        return { error: true, message: 'Alias already exists' };
      } else {
        console.error('An error occurred:', error.message);
        return { error: true, message: error.message };
      }
    } else {
      console.error('An error occurred:', error.message);
      return { error: true, message: error.message };
    }
  }
}

// ...existing code...
