const express = require('express');
const router = express.Router();
const { SceGithubApiHandler } = require('../util/SceGithubApiHandler');
const {
  CLIENT_ID,
  CLIENT_SECRET
} = require('../../config/config.json').githubApiKeys;
const {
  OK,
  NOT_FOUND
} = require('../../util/constants').STATUS_CODES;

/**
 * Call to Github API to retrieve active Pull Requests in a given repository
 */
router.get('/getPullRequestsFromRepo', (req, res) => {
  if(CLIENT_ID != 'NOT_SET' && CLIENT_SECRET != 'NOT_SET') {
    return res.sendStatus(OK);
  }
  const apiHandler = new SceGithubApiHandler(CLIENT_ID, CLIENT_SECRET);
  const repository = req.body.repository || req.query.repository;
  apiHandler.getPullRequestsFromRepo(repository)
    .then(pullRequests => {
      if(!pullRequests) {
        res.sendStatus(NOT_FOUND);
      } else {
        res.status(OK).send({ pullRequests });
      }
    })
    .catch(_ => {
      res.sendStatus(NOT_FOUND);
    });
});

/**
 * Call to Github API to retrieve an ordered list of a repository's
 * contributors in the past month
 */
router.get('/getContributorsInPastMonthFromRepo', (req, res) => {
  if(CLIENT_ID != 'NOT_SET' && CLIENT_SECRET != 'NOT_SET') {
    return res.sendStatus(OK);
  }
  const apiHandler = new SceGithubApiHandler(CLIENT_ID, CLIENT_SECRET);
  const repository = req.body.repository || req.query.repository;
  apiHandler.getContributorsInPastMonthFromRepo(repository)
    .then(contributors => {
      if(!contributors) {
        res.sendStatus(NOT_FOUND);
      } else {
        res.status(OK).send({ contributors });
      }
    })
    .catch(_ => {
      res.sendStatus(NOT_FOUND);
    });
});

/**
 * Call to Github API to retrieve all commits made to
 * a repository
 */
router.get('/getCommitsFromRepo', (req, res) => {
  if(CLIENT_ID != 'NOT_SET' && CLIENT_SECRET != 'NOT_SET') {
    return res.sendStatus(OK);
  }
  const apiHandler = new SceGithubApiHandler(CLIENT_ID, CLIENT_SECRET);
  const repository = req.body.repository || req.query.repository;
  apiHandler.getCommitsFromRepo(repository)
    .then(commits => {
      if(!commits) {
        res.sendStatus(NOT_FOUND);
      } else {
        res.status(OK).send({ commits });
      }
    })
    .catch(_ => {
      res.sendStatus(NOT_FOUND);
    });
});

module.exports = router;
