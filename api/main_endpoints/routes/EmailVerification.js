const express = require('express');
const router = express.Router();
const axios = require('axios');
const { OK, BAD_REQUEST, FORBIDDEN, UNAUTHORIZED, NOT_FOUND } = require('../../util/constants').STATUS_CODES;
const { BASE_API_URL } = require('../../../src/Enums')

router.post('/sendEmail', async (req, res) => {
  if (!checkIfTokenSent(req)) {
    return res.sendStatus(FORBIDDEN);
  } else if (!await decodeToken(req)) {
    return res.sendStatus(UNAUTHORIZED);
  }
  const url = new URL('/cloudapi/Auth/sendVerificationEmail', BASE_API_URL);
  const {email, token} = req.body;
  try {
    const response = await axios.post(
        url.href,
        {
          email
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        },
    ).then(()=> {
        res.sendStatus(OK);
    })
  } catch {
    res.sendStatus(BAD_REQUEST);
  }
})