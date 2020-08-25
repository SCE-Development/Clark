'use strict';
const inquirer = require('inquirer');
const { consoleColors } = require('../util/constants');

const {
  redColor,
  greenColor,
  blueColor,
  defaultColor
} = consoleColors;

console.debug(blueColor, 'Dependabot Tester CLI!', defaultColor);

inquirer
  .prompt([
    // pass questions
  ])
  .then(answers => {
    // user feedback
  })
  .catch(error => {
    if(error.isTtyError) {
      console.debug(redColor, 'Prompt couldn\'t be rendered in the current' 
                                    + 'environment', defaultColor);
    }
  });
