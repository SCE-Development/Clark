import axios from 'axios';

async function requestReset(email) {
  try {
    const res = await axios.post(
      'http://localhost:8080/api/Auth/request-reset',
      {
        email: email
      }
    );
    return {
      success: true
    };
  } catch (error) {
    return {
      success: false
    };
  }
}

async function validateToken(token) {
  try {
    const res = await axios.put(
      'http://localhost:8080/api/Auth/validate-reset-token',
      {
        token: token
      }
    );
    return {
      success: res.data.success,
      email: res.data.email
    };
  } catch (error) {
    return {
      success: false
    };
  }
}

async function resetPassword(newPassword, email, token) {
  try {
    const res = await axios.post(
      'http://localhost:8080/api/Auth/reset-password',
      {
        newPassword: newPassword,
        email: email,
        token: token
      }
    );
    return {
      success: true,
    };
  } catch (err) {
    // https://dev.to/zelig880/how-to-catch-the-body-of-an-axios-error-4lk0
    if (err.response) {
      const errBody = err.response.data;
      // eslint-disable-next-line
      console.log(errBody);
      return {
        success: errBody.success,
        error: errBody.error,
        detail: errBody.detail
      };
    }
  }
}

export {
  requestReset,
  validateToken,
  resetPassword
};
