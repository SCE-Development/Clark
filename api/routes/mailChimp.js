// PROJECT:   Core-v4
//  Name:    R. Javier
//  File:    api/routes/membershipApplication/index.js
//  Date Created:  March 17, 2019
//  Last Modified:  March 17, 2019
//  Details:
//      This file contains routing logic to service all routes requested under the the
//                  "/memberApplication" endpoint (a.k.a. the Membership Application Module)
//     which is publicly exposed to allow applications from the public facing site.
//  Dependencies:
//      JavaScript ECMAscript 6

'use strict'

// Includes (include as many as you need; the bare essentials are included here)
const express = require('express')
const router = express.Router()

// Utilize this structure when building out mailchimp
// router.post('/mailchimptest', (req, res) => {
//   if (req.body.username) {
//     console.log(req.body.username)
//     res.sendStatus(200)
//   } else {
//     res.status(409).send({ message: 'unknown...' })
//   }
// })

// Use the existing API until the mailchimp API gets built out
const settings = require('../../util/settings')
const al = require(`${settings.util}/../_deprecated_util/api_legend.js`)
const logger = require(`${settings.util}/logger`)
const smci = require(`${settings.util}/../util/smci/smci.js`)
const api = al.createLegend(
  'Example API Name',
  'Example API Desc',
  router // reference to the router object
)
const apiInfo = {
  args: {},
  rval: {}
}
apiInfo.args.example = [
  {
    name: 'API argument #1',
    type: '~string', // "~" = optional
    desc: 'An optional string argument for this API'
  }
]
apiInfo.rval.example = [
  {
    condition: 'On success',
    desc: 'This function returns true'
  },
  {
    condition: 'On failure',
    desc: 'This function returns false'
  }
]
api.register(
  'Example API Endpoint Name',
  'GET', // http request type string
  '/mailchimptest',
  'POST to mailchimp',
  apiInfo.args.example, // the API's request arguments (i.e. body/querystring)
  apiInfo.rval.example, // the API's response/return values
  function (request, response) {
    // Initialize
    const handlerTag = { src: '(get) /api/ability/ping' }
    logger.log(`Sending response to client @ ip ${request.ip}`, handlerTag)

    // smci.api.getRoot(null, function(res, err) {
    //  logger.log("Sending response " + JSON.stringify(res));
    //  response.status(200).send(res).end();
    // });

    smci.campaigns.create(
      {
        type: 'regular',
        recipients: {
          list_id: '2f831f6fd8'
        },
        settings: {
          subject_line: 'Mailchimp Test 3/14/2019',
          title: 'Mailchimp Test 3/14/2019',
          from_name: 'SCE Dev Test',
          reply_to: 'sce.sjsu@gmail.com'
        }
      },
      function (res, err) {
        logger.log('Sending response ' + JSON.stringify(res))
        const campaignId = res.id
        const campaignContents = {
          template: {
            id: 293933
          }
        }
        smci.campaigns.setCampaignContent(
          campaignId,
          campaignContents,
          function (res2, err2) {
            if (res2) {
              smci.campaigns.sendCampaign(campaignId, function (res1, err1) {
                try {
                  // console.log( res1 );
                  response
                    .status(200)
                    .send({ success: true })
                    .end()
                } catch (exception) {
                  console.log(exception)
                  response
                    .status(500)
                    .send({ RES1: JSON.stringify(res1) })
                    .end()
                }
              })
            }
          }
        )
      }
    )
  }
)

module.exports = router
