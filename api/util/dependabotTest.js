'use strict';
const inquirer = require('inquirer');
const { consoleColors } = require('../util/constants');
const { SceGithubApiHandler } = require('../cloud_api/util/SceGithubApiHandler');
const {
  CLIENT_ID,
  CLIENT_SECRET
} = require('../config/config.json').githubApiKeys;
const {
  redColor,
  greenColor,
  blueColor,
  defaultColor
} = consoleColors;

async function getPullRequests() {
  const apiHandler = new SceGithubApiHandler(CLIENT_ID, CLIENT_SECRET);
  const repoName = 'Core-V4';
  let pullRequests = await apiHandler.getPullRequestsFromRepo(repoName);
  // console.log(pullRequests);
  let i = 0;
  for (i; i < pullRequests.length; i++) {
    await apiHandler.getBranchesForPullRequest(repoName, pullRequests[i].number).then(console.log());
  }
  return pullRequests;
}
getPullRequests();
console.debug(blueColor, 'Dependabot Tester CLI!', defaultColor);

// inquirer
//   .prompt([
//     // pass questions
//   ])
//   .then(answers => {
//     // user feedback
//   })
//   .catch(error => {
//     if(error.isTtyError) {
//       console.debug(redColor, 'Prompt couldn\'t be rendered in the current' 
//                                     + 'environment', defaultColor);
//     }
//   });
