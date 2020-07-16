const express = require("express");
const router = express.Router();
const { SceGoogleApiHandler } = require("../util/SceGoogleApiHandler");
const { verification } = require("../email_templates/verification");
const { OK, BAD_REQUEST } = require("../../util/constants").STATUS_CODES;
const { googleApiKeys } = require("../../config/config.json");
const { USER } = googleApiKeys;
const { blastEmail } = require("../email_templates/blastEmail");

// router.post("/sendVerificationEmail", async (req, res) => {
//   const scopes = ["https://mail.google.com/"];
//   const pathToToken = __dirname + "/../../config/token.json";
//   const apiHandler = new SceGoogleApiHandler(scopes, pathToToken);
//   const tokenJson = await apiHandler.checkIfTokenFileExists();

//   if (tokenJson) {
//     if (apiHandler.checkIfTokenIsExpired(tokenJson)) {
//       apiHandler.refreshToken();
//     }
//   } else {
//     apiHandler.getNewToken();
//   }

//   await verification(USER, req.body.recipientEmail, req.body.recipientName)
//     .then((template) => {
//       apiHandler
//         .sendEmail(template)
//         .then((_) => {
//           res.sendStatus(OK);
//         })
//         .catch((_) => {
//           res.sendStatus(BAD_REQUEST);
//         });
//     })
//     .catch((_) => {
//       res.sendStatus(BAD_REQUEST);
//     });
// });

//New /sendVerificationEmail post, removed function used to refresh the token
router.post("/sendVerificationEmail", async (req, res) => {
  const scopes = ["https://mail.google.com/"];
  const pathToToken = __dirname + "/../../config/token.json";
  const apiHandler = new SceGoogleApiHandler(scopes, pathToToken);

  await verification(USER, req.body.recipientEmail, req.body.recipientName)
    .then((template) => {
      apiHandler
        .justinSendEmail(template)
        .then((_) => {
          res.sendStatus(OK);
        })
        .catch((_) => {
          res.sendStatus(BAD_REQUEST);
        });
    })
    .catch((_) => {
      res.sendStatus(BAD_REQUEST);
    });
});

///sendBlastEmail post, used in sending email blasts/blast emails
router.post("/sendBlastEmail", async (req, res) => {
  const scopes = ["https://mail.google.com/"];
  const pathToToken = __dirname + "/../../config/token.json";
  const apiHandler = new SceGoogleApiHandler(scopes, pathToToken);

  await blastEmail(
    USER,
    req.body.recipientEmail,
    req.body.blastSubject,
    req.body.blastContent
  )
    .then((template) => {
      apiHandler
        .justinSendEmail(template)
        .then((_) => {
          res.sendStatus(OK);
        })
        .catch((_) => {
          res.sendStatus(BAD_REQUEST);
        });
    })
    .catch((_) => {
      res.sendStatus(BAD_REQUEST);
    });
});

module.exports = router;
