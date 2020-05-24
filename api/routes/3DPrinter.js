const express = require('express');
const router = express.Router();
const {
  send3dPrintRequest
} = require('../printingRPC/client/printing_3d/print_3d_client');
const { OK, BAD_REQUEST } = require('../constants').STATUS_CODES;

router.post('/submit3D', async (req, res) => {
  const { raw, memberName, volume, copies } = req.body;
  await send3dPrintRequest(raw, memberName, volume, copies)
    .then(response => {
      return res.status(OK).send({ ...response });
    })
    .catch(error => {
      return res.status(BAD_REQUEST).send({ ...error });
    });
});

module.exports = router;
