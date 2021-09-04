'use strict';
const User = require('../models/User.js');
const inquirer = require('inquirer');
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
let membershipState = require('../../src/Enums.js');
membershipState = membershipState.membershipState;
const { consoleColors } = require('../util/constants');

const {
  redColor,
  greenColor,
  blueColor,
  defaultColor
} = consoleColors;

console.debug(blueColor, 'Welcome to the SCE User Creation CLI!', defaultColor);
inquirer
  .prompt([
    {
      type: 'input',
      name: 'email',
      message: 'What\'s your email:'
    },
    {
      type: 'input',
      name: 'firstName',
      message: 'Please enter a first name for your account (default: "Dummy"):'
    },
    {
      type: 'input',
      name: 'lastName',
      message: 'Please enter a last name for your account (defualt: "Account"):'
    },
    {
      type: 'input',
      name: 'password',
      message: 'Please enter a password (default: "sce"):'
    },
    {
      type: 'list',
      name: 'accountLevel',
      message: 'Choose an account level from the list below: ',
      choices: [
        {
          name: 'Admin',
          value: membershipState.ADMIN
        },
        {
          name: 'Officer',
          value: membershipState.OFFICER
        },
        {
          name: 'Member',
          value: membershipState.MEMBER
        },
        {
          name: 'Non-Member',
          value: membershipState.NON_MEMBER
        },
        {
          name: 'Pending',
          value: membershipState.PENDING
        },
        {
          name: 'Banned',
          value: membershipState.BANNED
        },
        {
          name: 'Alumni',
          value: membershipState.ALUMNI
        }
      ],
      filter: function(val) {
        console.debug(val);
        return val;
      }
    }
  ])
  .then(async (answers) => {
    const newUser = new User({
      password: answers.password || 'sce',
      firstName: answers.firstName || 'Dummy',
      lastName: answers.lastName || 'Account',
      email: answers.email,
      emailVerified: true,
      accessLevel: answers.accountLevel
    });
    this.mongoose = mongoose;
    this.mongoose
      .connect('mongodb://localhost/sce_core', {
        promiseLibrary: require('bluebird'),
        useNewUrlParser: true,
        serverSelectionTimeoutMS: 3000,
        useUnifiedTopology: true,
        useCreateIndex: true
      })
      .catch(_ => {
        console.debug(redColor, 'MongoDB Connection Unsuccessful. Are you sure'
                     + ' MongoDB is running?', defaultColor);
        process.exit();
      });
    await newUser.save()
      .then(_ => {
        console.debug(greenColor, 'Account with email ' + answers.email
                    + ' and password '
                    + ((answers.password) ? answers.password : 'sce')
                    + ' succesfully created.', defaultColor);
        this.mongoose.connection.close();
      })
      .catch(_=> {
        console.debug(redColor, 'Account creation unsuccessful. Please try'
                                + ' running the user creation script'
                                + ' again.', defaultColor);
        this.mongoose.connection.close();
        process.exit();
      });
  })
  .catch(error => {
    if(error.isTTyError) {
      console.debug(redColor, error, 'prompt couldn\'t be rendered in tty'
                    + 'environment.', defaultColor);
    } else {
      console.debug(redColor, error, 'error processing response.',
        defaultColor);
    }
  });
