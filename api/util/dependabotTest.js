'use strict';
const inquirer = require('inquirer');
const { consoleColors } = require('../util/constants');
const {
  CLIENT_ID,
  CLIENT_SECRET
} = require('../config/config.json').githubApiKeys;
const { exec } = require('child_process');
const {
  redColor,
  greenColor,
  blueColor,
  defaultColor
} = consoleColors;
const {
  SceGithubApiHandler
} = require('../cloud_api/util/SceGithubApiHandler');


async function getPullRequestsAndBranches() {
  const apiHandler = new SceGithubApiHandler(CLIENT_ID, CLIENT_SECRET);
  const repoName = 'Core-V4';
  let pullRequests = await apiHandler.getPullRequestsFromRepo(repoName);
  for (let i = 0; i < pullRequests.length; i++) {
    pullRequests[i]['name'] = pullRequests[i]['title'];
    pullRequests[i]['value'] = pullRequests[i]['branchName'];
    delete pullRequests[i]['title'];
    delete pullRequests[i]['branchName'];
  }
  return pullRequests;
}

async function restoftheprojectlmaoooo(data) {
  // pass
  console.log(data);
  exec('git stash', (error, stdout, stderr) => {
    if (error) {
      console.log('error: ', `${error.message}`);
      return;
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
  });
  exec('git checkout dev', (error, stdout, stderr) => {
    if (error) {
      console.log('error: ', `${error.message}`);
      return;
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
  });
  exec('git fetch origin', (error, stdout, stderr) => {
    if (error) {
      console.log('error: ', `${error.message}`);
      return;
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
  });
  exec(`git checkout ${data.branchName}`, (error, stdout, stderr) => {
    if (error) {
      console.log('error: ', `${error.message}`);
      return;
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
  });
}

getPullRequestsAndBranches()
  .then(data => {
    console.debug(blueColor, 'Welcome to the SCE PR Tester!', defaultColor);
    inquirer
      .prompt([
        {
          type: 'list',
          name: 'branchName',
          message: 'Choose a PR that you want to test',
          choices: data
        },
        {
          type: 'list',
          name: 'deleteNodeModules',
          message: 'Where do you want to delete node modules from?',
          choices: [
            {
              name: 'Frontend portion only',
              value: 'frontend'
            },
            {
              name: 'Backend portion only',
              value: 'backend'
            },
            {
              name: 'Both backend and frontend (choose this for dependabots)',
              value: 'bothFrontendAndBackend'
            }
          ]
        },
        {
          type: 'list',
          name: 'npmRUN',
          message: 'Which part of the website do you want to run?',
          choices: [
            {
              name: 'Run me the frontend',
              value: 'frontend'
            },
            {
              name: 'Gimme the backend',
              value: 'backend'
            },
            {
              name: 'I need to run both',
              value: 'bothFrontendAndBackend'
            }
          ]
        },
        // pass questions
      ])
      .then(answers => {
        // user feedback
        // console.log(answers);
        restoftheprojectlmaoooo(answers);
      })
      .catch(error => {
        if(error.isTtyError) {
          console.debug(redColor, 'Prompt couldn\'t be rendered in the current'
                                    + 'environment', defaultColor);
        }
      });
  });
