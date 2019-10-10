// running `node mock-database.js` should mock members into the DB
// Use Mongoose to put the data in

//
const mongoose = require('mongoose')
const User = require('../api/models/user')
const PrintingForm3D = require('../api/models/PrintingForm3D')

const users = require('./mocked-data/users')
const forms = require('./mocked-data/3DPrintingForm')

function connectToDatabase () {
  return new Promise((resolve, reject) => {
    mongoose.Promise = require('bluebird')
    mongoose
      .connect('mongodb://localhost/sce_core', {
        promiseLibrary: require('bluebird'),
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
      })
      .then(() => {
        console.log('MongoDB Connection Successful')
        console.log()
        resolve()
      })
      .catch(error => reject(new Error(error)))
  })
}

function disconnectFromDatabase () {
  console.log('Disconnecting from MongoDB')
  mongoose.connection.close()
}

function createUsers () {
  const promises = []
  console.log('Creating Users...')

  promises.push(
    new Promise((resolve, reject) => {
      for (const user in users) {
        const newUser = new User({
          password: users[user].password,
          firstName: users[user].firstName,
          lastName: users[user].lastName,
          email: users[user].email
        })

        newUser.save(function (error) {
          if (error) {
            reject(error)
            return
          }
          resolve()
        })
      }
    })
  )

  return Promise.all(promises)
}

function create3DForms () {
  const promises = []
  console.log('Creating 3DPrintingForms...')

  promises.push(
    new Promise((resolve, reject) => {
      for (const form in forms) {
        PrintingForm3D.create(forms[form], (error, post) => {
          if (error) {
            reject(error)
            return
          }

          resolve()
        })
      }
    })
  )

  return Promise.all(promises)
}

function inputData () {
  return new Promise((resolve, reject) => {
    createUsers()
      .then(() => {
        console.log('Successfully added Users\n')
        return create3DForms()
      })
      .then(() => {
        console.log('Successfully added 3DPrintingForms\n')
        resolve()
      })
      .catch(err => reject(err))
  })
}

connectToDatabase()
  .then(() => {
    return inputData()
  })
  .then(() => {
    return disconnectFromDatabase()
  })
  .catch(err => console.log(err))
