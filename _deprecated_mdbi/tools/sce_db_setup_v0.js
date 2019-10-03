// PROJECT:   Core-v4
//  Name:    Rolando Javier
//  File:    sce_db_setup_v0.js
//  Date Created:  January 22, 2018
//  Last Modified:  March 30, 2018
//  Dependencies:
//      schema_v0.js (the database schema file describing the database structure)
//      cryptic.js (for password hashing)
//     MongoDB v3.4.x or above
//  Details:
//      This file contains the setup script for the SCE MongoDB. It creates the necessary database collections if they don't already exist.
//     The script can be run using the command "node sce_db_setup.js", but can also be controlled manually by passing in a third argument after the file name:
//      "--stats"
//          This command prints database statistics. Useful for determing the db size if the db exists.
//      "--init"
//          This command makes sure to create the necessary database collections if they do not exist. This is the default behavior if the third parameter was omitted.
//  Dependencies:
//      n/a

'use strict'

// Includes
const settings = require('../../util/settings')
const credentials = require(settings.credentials).mdbi
// const cryptic = require(`${settings.util}/cryptic`)
const syskey = require(settings.credentials).syskey
const schema = require('./schema_v0')
// const assert = require('assert')
const arg = process.argv[2]
const args = process.argv
const mongoSettings = require('../mongo_settings')
const mongo = require('mongodb').MongoClient
const mdb = require('../mongoWrapper') // acquire MongoDB API Wrappers
const logger = require(`${settings.util}/logger`)
const ef = require(`${settings.util}/error_formats`)

// Globals
const mongoOptions = {
  appname: 'SCE DB Setup v0'
}
const placeholders = require('./res/placeholders.json')
const dbDefaults = require('./res/defaults.json')

// Mock Data (member ids foreign key constraint: 0-12 are the only existing memberIDs)
const mockMembers = require('./res/mockMembers.json')
const mockMemberData = require('./res/mockMembershipData.json')
const mockAnnouncements = require('./res/mockAnnouncements.json')
const mockDoorCodes = require('./res/mockDoorCodes.json')
const url = `mongodb://${encodeURIComponent(
  credentials.user
)}:${encodeURIComponent(credentials.pwd)}@${mongoSettings.hostname}:${
  mongoSettings.port
}/${mongoSettings.database}?authSource=sce_core`

// BEGIN Database Client
if (arg === '--help') {
  help()
} else {
  mongo.connect(url, mongoOptions, function (err, db) {
    console.log('Server connection established. Authenticating...')

    // Authenticate
    if (!err) {
      console.log('Auth Successful...')

      // Handle arguments
      if (args.includes('--stats')) {
        // Get database stats
        console.log('Getting db statistics...')
        db.command({ dbStats: 1 }, function (err, results) {
          if (err) {
            console.log(typeof err === 'object' ? JSON.stringify(err) : err)
          } else {
            console.log(results)
          }

          // End database connection
          endSession(db)
        })
      } else if (args.includes('--format')) {
        // Format the database
        console.log(
          'WARNING: You are about to delete all records in the database! Are you sure? (Yes/No)'
        )
        process.stdin.on('readable', function () {
          const chunk = process.stdin.read()
          if (chunk !== null) {
            const answer = chunk.slice(0, chunk.length - 1)
            if (answer.toString().toLowerCase() === 'yes') {
              console.log('Dropping entire SCE database...')

              const deletionPromises = []
              for (let i = 0; i < schema.collectionNames.length; i++) {
                deletionPromises[i] = new Promise(function (resolve, reject) {
                  const target = schema.collectionNames[i]
                  db.dropCollection(target, null, function (error, result) {
                    if (error) {
                      console.log(
                        `Failed to drop ${target} collection: ${error}`
                      )
                      reject(new Error(error))
                    } else {
                      console.log(
                        `Collection ${target} dropped?: ${JSON.stringify(
                          result
                        )}`
                      )
                      resolve()
                    }
                  })
                })
              }

              Promise.all(deletionPromises)
                .then(function (results) {
                  console.log(`Database format complete: ${results}`)
                  process.kill(process.pid, 'SIGINT') // needs to implement Promises
                })
                .catch(function (error) {
                  console.log(`Failed to complete database format: ${error}`)
                  process.kill(process.pid, 'SIGINT') // needs to implement Promises
                })
            } else if (answer.toString().toLowerCase() === 'no') {
              console.log('Aborting...')
              process.kill(process.pid, 'SIGINT')
            } else {
              console.log(
                `I didn't understand "${answer.toString()}". Please say Yes or No...`
              )
            }
          }
        })
      } else if (args.includes('--init') || args.includes('--mock')) {
        // Manually create the required collections using MongoDB functions (do not use Mongo Wrappers, since they have a security feature that blocks the creation of new collections that do not exist)...
        console.log('Initializing db to SCE specifications...')
        mdb.database = db
        const dbSchemasToApply = []
        const dbViewsToApply = []
        const dbDefaultsToApply = []

        // BEGIN db schema application promises
        const addServerActivations = new Promise(function (resolve, reject) {
          db.collection('serverActivations').insertOne(
            placeholders.serverActivations,
            null,
            function (error, result) {
              if (error) {
                console.log(
                  `Error creating collection serverActivations: ${error}`
                )
                reject(new Error(error))
              } else {
                resolve()
              }
            }
          )
        })
        dbSchemasToApply.push(addServerActivations)

        const addMember = new Promise(function (resolve, reject) {
          db.collection('Member').insertOne(placeholders.Member, null, function (
            error,
            result
          ) {
            if (error) {
              console.log(`Error creating collection Member: ${error}`)
              reject(new Error(error))
            } else {
              // Apply Member collection index
              const indexTraits = {
                collection: 'Member',
                iname: 'sceMemberIndex',
                fields: ['firstName', 'lastName', 'userName', 'email']
              }
              defineTextIndex(db, indexTraits, function (err, result) {
                if (err) {
                  console.log(`Error indexing collection Member: ${err}`)
                  reject(new Error(err))
                } else {
                  resolve()
                }
              })
            }
          })
        })
        dbSchemasToApply.push(addMember)

        const addMembershipData = new Promise(function (resolve, reject) {
          db.collection('MembershipData').insertOne(
            placeholders.MembershipData,
            null,
            function (error, result) {
              if (error) {
                console.log(
                  `Error creating collection MembershipData: ${error}`
                )
                reject(new Error(error))
              } else {
                resolve()
              }
            }
          )
        })
        dbSchemasToApply.push(addMembershipData)

        const addDoorCode = new Promise(function (resolve, reject) {
          db.collection('DoorCode').insertOne(
            placeholders.DoorCode,
            null,
            function (error, result) {
              if (error) {
                console.log(`Error creating collection DoorCode: ${error}`)
                reject(new Error(error))
              } else {
                resolve()
              }
            }
          )
        })
        dbSchemasToApply.push(addDoorCode)

        const addClearanceLevel = new Promise(function (resolve, reject) {
          db.collection('ClearanceLevel').insertOne(
            placeholders.ClearanceLevel,
            null,
            function (error, result) {
              if (error) {
                console.log(
                  `Error creating collection ClearanceLevel: ${error}`
                )
                reject(new Error(error))
              } else {
                resolve()
              }
            }
          )
        })
        dbSchemasToApply.push(addClearanceLevel)

        const addAbility = new Promise(function (resolve, reject) {
          db.collection('Ability').insertOne(
            placeholders.Ability,
            null,
            function (error, result) {
              if (error) {
                console.log(`Error creating collection Ability: ${error}`)
                reject(new Error(error))
              } else {
                resolve()
              }
            }
          )
        })
        dbSchemasToApply.push(addAbility)

        const addSessionData = new Promise(function (resolve, reject) {
          db.collection('SessionData').insertOne(
            placeholders.SessionData,
            null,
            function (error, result) {
              if (error) {
                console.log(`Error creating collection SessionData: ${error}`)
                reject(new Error(error))
              } else {
                resolve()
              }
            }
          )
        })
        dbSchemasToApply.push(addSessionData)

        const addAnnouncement = new Promise(function (resolve, reject) {
          db.collection('Announcement').insertOne(
            placeholders.Announcement,
            null,
            function (error, result) {
              if (error) {
                console.log(`Error creating collection Announcement: ${error}`)
                reject(new Error(error))
              } else {
                // Apply Announcement collection index
                const indexTraits = {
                  collection: 'Announcement',
                  iname: 'sceAnnouncementIndex',
                  fields: ['title', 'msgContent']
                }
                defineTextIndex(db, indexTraits, function (err, result) {
                  if (err) {
                    console.log(
                      `Error indexing collection Announcement: ${err}`
                    )
                    reject(new Error(error))
                  } else {
                    resolve()
                  }
                })
              }
            }
          )
        })
        dbSchemasToApply.push(addAnnouncement)

        const addOfficerApplication = new Promise(function (resolve, reject) {
          db.collection('OfficerApplication').insertOne(
            placeholders.OfficerApplication,
            null,
            function (error, result) {
              if (error) {
                console.log(
                  `Error creating collection OfficerApplication: ${error}`
                )
                reject(new Error(error))
              } else {
                resolve()
              }
            }
          )
        })
        dbSchemasToApply.push(addOfficerApplication)

        const addAutoIncrements = new Promise(function (resolve, reject) {
          db.collection('autoIncrements').insertOne(
            placeholders.autoIncrements,
            null,
            function (error, result) {
              if (error) {
                console.log(
                  `Error creating collection autoIncrements: ${error}`
                )
                reject(new Error(error))
              } else {
                resolve()
              }
            }
          )
        })
        dbSchemasToApply.push(addAutoIncrements)
        // END db schema application promises

        // BEGIN db defaults promises
        const addDefaultLevels = new Promise(function (resolve, reject) {
          try {
            db.collection('ClearanceLevel').insertMany(
              dbDefaults.ClearanceLevel
            )
            resolve()
          } catch (e) {
            console.log(`Error adding default levels: ${e}`)
            reject(new Error(e))
          }
        })
        dbDefaultsToApply.push(addDefaultLevels)

        const addDefaultAbilities = new Promise(function (resolve, reject) {
          try {
            db.collection('Ability').insertMany(dbDefaults.Ability)
            resolve()
          } catch (e) {
            console.log(`Error adding default abilities: ${e}`)
            reject(new Error(e))
          }
        })
        dbDefaultsToApply.push(addDefaultAbilities)

        const addAdminUser = new Promise(function (resolve, reject) {
          db.collection('Member').insertOne(syskey, null, function (
            error,
            result
          ) {
            if (error) {
              console.log(`Error creating syskey: ${error}`)
              reject(new Error(error))
            } else {
              resolve()
            }
          })
        })

        const addAdminMembership = new Promise(function (resolve, reject) {
          const membershipData = {
            memberID: 0,
            startTerm: new Date(Date.now()),
            endTerm: new Date(Date.UTC(3005, 0)), // Jan, 3005
            doorCodeID: 0,
            gradDate: new Date(Date.UTC(3005, 0)), // Jan, 3005
            level: 0, // admin level
            membershipStatus: true
          }
          db.collection('MembershipData').insertOne(
            membershipData,
            null,
            function (error, result) {
              if (error) {
                console.log(`Error adding membership data: ${error}`)
                reject(new Error(error))
              } else {
                resolve()
              }
            }
          )
        })
        // END db defaults promises

        // BEGIN db views application promises
        const addMemberDossierView = new Promise(function (resolve, reject) {
          const memberDossierCommand = {
            create: 'MemberDossier',
            viewOn: 'Member',
            pipeline: [
              {
                $lookup: {
                  from: 'MembershipData',
                  localField: 'memberID',
                  foreignField: 'memberID',
                  as: 'memPlanData'
                }
              },
              {
                $lookup: {
                  from: 'DoorCode',
                  localField: 'memPlanData.doorCodeID',
                  foreignField: 'dcID',
                  as: 'dcInfo'
                }
              },
              {
                $replaceRoot: {
                  newRoot: {
                    memberID: '$memberID',
                    firstName: '$firstName',
                    middleInitial: '$middleInitial',
                    lastName: '$lastName',
                    joinDate: '$joinDate',
                    userName: '$userName',
                    email: '$email',
                    emailVerified: '$emailVerified',
                    emailOptIn: '$emailOptIn',
                    major: '$major',
                    startTerm: '$memPlanData.startTerm',
                    endTerm: '$memPlanData.endTerm',
                    doorcode: '$dcInfo.code',
                    gradDate: '$memPlanDatagradDate',
                    membershipStatus: '$memPlanData.membershipStatus'
                  }
                }
              },
              {
                $unwind: '$doorcode'
              },
              {
                $unwind: '$membershipStatus'
              },
              {
                $unwind: '$startTerm'
              },
              {
                $unwind: '$endTerm'
              }
            ]
          }

          // If the user doesn't have the "readWrite" role, this operation may not be possible!
          try {
            db.command(memberDossierCommand, null, function (error, result) {
              if (error) {
                console.log(`Error creating MemberDossier view: ${error}`)
                reject(new Error(error))
              } else {
                resolve()
              }
            })
          } catch (e) {
            console.log(`Error excuting db.command(): ${e}`)
            reject(new Error(e))
          }
        })
        dbViewsToApply.push(addMemberDossierView)

        const addOfficerDossierView = new Promise(function (resolve, reject) {
          const officerDossierCommand = {
            create: 'OfficerDossier',
            viewOn: 'Member',
            pipeline: [
              {
                $lookup: {
                  from: 'MembershipData',
                  localField: 'memberID',
                  foreignField: 'memberID',
                  as: 'memPlanData'
                }
              },
              {
                $match: {
                  $or: [
                    {
                      'memPlanData.level': 0
                    },
                    {
                      'memPlanData.level': 1
                    }
                  ]
                }
              },
              {
                $lookup: {
                  from: 'ClearanceLevel',
                  localField: 'memPlanData.level',
                  foreignField: 'cID',
                  as: 'clevel'
                }
              },
              {
                $replaceRoot: {
                  newRoot: {
                    memberID: '$memberID',
                    fullName: {
                      $concat: [
                        '$firstName',
                        ' ',
                        '$middleInitial',
                        ' ',
                        '$lastName'
                      ]
                    },
                    userName: '$userName',
                    email: '$email',
                    lastLogin: '$lastLogin',
                    level: '$clevel.cID',
                    levelName: '$clevel.levelName',
                    abilities: '$clevel.abilities'
                  }
                }
              },
              {
                $unwind: '$levelName'
              },
              {
                $unwind: '$level'
              },
              {
                $unwind: '$abilities'
              }
            ]
          }

          // If the user doesn't have the "readWrite" role, this operation may not be possible!
          try {
            db.command(officerDossierCommand, null, function (error, result) {
              if (error) {
                console.log(`Error creating OfficerDossier view: ${error}`)
                reject(new Error(error))
              } else {
                resolve()
              }
            })
          } catch (e) {
            console.log(`Error excuting db.command(): ${e}`)
            reject(new Error(e))
          }
        })
        dbViewsToApply.push(addOfficerDossierView)

        const addCoreAccessView = new Promise(function (resolve, reject) {
          const coreAccessCommand = {
            create: 'CoreAccess',
            viewOn: 'Member',
            pipeline: [
              {
                $lookup: {
                  from: 'MembershipData',
                  localField: 'memberID',
                  foreignField: 'memberID',
                  as: 'memPlanData'
                }
              },
              {
                $match: {
                  $or: [
                    {
                      'memPlanData.level': 0
                    },
                    {
                      'memPlanData.level': 1
                    }
                  ]
                }
              },
              {
                $replaceRoot: {
                  newRoot: {
                    memberID: '$memberID',
                    userName: '$userName',
                    passWord: '$passWord',
                    level: '$memPlanData.level'
                  }
                }
              },
              {
                $unwind: '$level'
              }
            ]
          }

          // If the user doesn't have the "readWrite" role, this operation may not be possible!
          try {
            db.command(coreAccessCommand, null, function (error, result) {
              if (error) {
                console.log(`Error creating CoreAccess view: ${error}`)
                reject(new Error(error))
              } else {
                resolve()
              }
            })
          } catch (e) {
            console.log(`Error excuting db.command(): ${e}`)
            reject(new Error(e))
          }
        })
        dbViewsToApply.push(addCoreAccessView)
        // END db views application promises

        // BEGIN add mock data routine
        const addMockData = function (messages) {
          console.log(`Root admin ${syskey.userName} successfully added...`)
          if (arg === '--mock') {
            console.log('Processing Option "--mock"...')
            const mockInitDb = new Promise(function (resolve, reject) {
              console.log('Mock-initializing...')
              mockInit(db, resolve, reject)
            })
            Promise.all([mockInitDb])
              .then(function (message) {
                console.log(
                  'Successfully initialized db with mock documents...'
                )
                endSession(db)
              })
              .catch(function (error) {
                console.log(
                  'Mock-initialization was unsuccessful! But logged an error'
                )
                console.log(error)
                if (db) {
                  endSession(db)
                }
              })
          } else {
            endSession(db)
          }
        }
        // END add mock data routine

        // BEGIN root user application routine
        const applyRootUser = function (messages) {
          console.log('Database views successfully created...')

          // Add the root admin user
          Promise.all([addAdminUser, addAdminMembership])
            .then(addMockData)
            .catch(function (error) {
              console.log(`Failed to add root admin: ${error}`)
              if (db) {
                endSession(db)
              }
            })
        }
        // END root user application routine

        // BEGIN database view creation routine
        const applyViews = function () {
          console.log('Database schema successfully applied...')

          // Apply the constious database views
          Promise.all(dbViewsToApply)
            .then(applyRootUser)
            .catch(function (error) {
              console.log(`Failed to create database views: ${error}`)
              if (db) {
                endSession(db)
              }
            })
        }
        // END database view creation routine

        // BEGIN schema application routine
        const applySchema = function () {
          Promise.all(dbSchemasToApply)
            .then(applyViews)
            .catch(function (error) {
              console.log(`Failed to apply database schema: ${error}`)
              if (db) {
                endSession(db)
              }
            })
        }
        // END schema application routine

        // Create database and apply schema
        applySchema()
      } else {
        help()
        if (db) {
          endSession(db)
        }
      }
    } else {
      // Report error and end database connection
      console.log(`Auth Failed: ${err}`)
      if (db) {
        endSession(db)
      }
    }
  })
}
// END Database Client

// BEGIN Utility Functions
/*
 @function  defineTextIndex
 @parameter  database - the mongo database object from MongoClient.connect()
 @parameter  settings - a JSON object of settings that define which collection (of the specified database) to apply the text index to. It must contain the following members:
     collection - the name of the collection to index
     iname - the text index name
     fields - a string array of field names to apply text indexes to (you can specify nested fields with dot-notation, i.e. "field.nestedfield")
 @parameter  callback - a callback function to run when the operation attempt completes. It is passed two arguments:
     error - if there was no error, this value is null; otherwise, it is a MongoError object
     result - if there was an error, this value is null; otherwise, it is an object detailing the results of the operation
 @returns  n/a
 @details  This function defines a Text Index for the given database with the given settings. It enables partial text searching with the db.collection(...).find() function using the "{$text: {"$search": ... }}" filter.
*/
function defineTextIndex (database, settings, callback) {
  const indexFields = {}
  const indexSettings = {
    name: settings.iname
  }

  // Created index fields
  for (let i = 0; i < settings.fields.length; i++) {
    indexFields[settings.fields[i]] = 'text'
  }

  database
    .collection(settings.collection)
    .createIndex(indexFields, indexSettings, callback)
}

/*
 @function  mockInit
 @parameter  database - the mongo database object from MongoClient.connect()
 @parameter  resolve - the resolve object passed on by a JavaScript Promise
 @parameter  reject - the reject object passed on by a JavaScript Promise
 @returns  n/a
 @details  This function executes a mock initialization of the database
*/
function mockInit (database, resolve, reject) {
  // Insert Mock Members
  database
    .collection('Member')
    .insertMany(mockMembers, function (err, response) {
      if (err) {
        console.log('Failed to insert mock members!')
        reject()
      } else {
        // Autoincrement Member collection
        autoIncrement(
          'Member',
          function () {
            // Then, insert mock Announcements
            database
              .collection('Announcement')
              .insertMany(mockAnnouncements, function (err, response) {
                if (err) {
                  console.log('Failed to insert mock announcements!')
                  reject()
                } else {
                  // Autoincrement Announcement collection
                  autoIncrement(
                    'Announcement',
                    function () {
                      // Then, insert mock DoorCodes
                      database
                        .collection('DoorCode')
                        .insertMany(mockDoorCodes, function (err, response) {
                          if (err) {
                            console.log('Failed to insert mock door codes!')
                            reject()
                          } else {
                            // Autoincrement DoorCode collection
                            autoIncrement(
                              'DoorCode',
                              function () {
                                // Then, insert mock MembershipData
                                database
                                  .collection('MembershipData')
                                  .insertMany(mockMemberData, function (
                                    err,
                                    response
                                  ) {
                                    if (err) {
                                      console.log(
                                        'Failed to insert mock member data!'
                                      )
                                      reject()
                                    } else {
                                      // Autoincrement MembershipData collection
                                      autoIncrement(
                                        'MembershipData',
                                        function () {
                                          // Complete the Promise chain
                                          console.log(
                                            'Mock-initialization complete'
                                          )
                                          resolve()
                                        },
                                        mockMemberData.length
                                      )
                                    }
                                  })
                              },
                              mockDoorCodes.length
                            )
                          }
                        })
                    },
                    mockAnnouncements.length
                  )
                }
              })
          },
          mockMembers.length
        )
      }
    })
}

/*
 @function autoIncrement
 @parameter collection - the name of the MongoDB collection to auto-increment
 @parameter callback - a callback function to run after auto incrementing. The callback is
       given two arguments:
       (object) error - An error formatted object if an error occurred;
           otherwise, this is null.
       (number) result - the current value of the collection's auto-increment
           record
 @parameter cnt - (optional) the number to increment by
 @returns n/a
 @details This function increments the specified collection by cnt, or 1 if cnt is omitted
*/
function autoIncrement (collection, callback, cnt = 1) {
  const handlerTag = { src: 'mongoWrapper.autoIncrement' }
  const query = {
    $inc: {}
  }
  query.$inc[collection] = cnt // increment the collection aincmt by "cnt"
  mdb.database
    .collection('autoIncrements')
    .updateOne(
      {
        autoIncrements: 0
      },
      query
    )
    .then(function (mongoResult) {
      // Determine what to do after the auto increment
      if (mongoResult.modifiedCount !== 1) {
        // Log the error and pass it to callback
        const emsg = `Error auto-incrementing: ${mongoResult}`
        logger.log(emsg, handlerTag)
        callback(
          ef.asCommonStr(ef.struct.mdbiNoEffect, {
            msg: emsg
          }),
          null
        )
      } else {
        // Acquire the value of the set number
        mdb.database
          .collection('autoIncrements')
          .findOne({
            autoIncrements: 0
          })
          .then(function (result, error) {
            // Check for errors
            if (error) {
              // Log the error
              const emsg = `Error acquiring autoIncrements snapshot: ${error}`
              logger.log(emsg, handlerTag)

              // Pass it to the callback
              callback(
                JSON.parse(
                  ef.asCommonStr(ef.struct.mdbiReadError, {
                    msg: emsg
                  })
                ),
                null
              )
            } else {
              // Run callback and give it the new value of the auto incremented record
              // logger.log( JSON.stringify(result), handlerTag ); // DEBUG
              callback(null, result[collection])
            }
          })
      }
    })
}

/*
 @function  endSession
 @parameter  mongoDatabase - the MongoDB database object returned from MongoClient.connect()
 @parameter  (optional) callback - a callback to run after completing the operation. This function is not passed any arguments.
 @returns  n/a
 @details  This function ends the MongoDB session by first logging out the authenticated user and closing the connection directly.
*/
function endSession (mongoDatabase, callback) {
  console.log('Ending session...')

  mongoDatabase.logout()
  mongoDatabase.close()

  if (typeof callback === 'function') {
    callback()
  }
}

/*
 @function  help
 @parameter  n/a
 @returns  n/a
 @details  This function prints a help prompt to console.
*/
function help () {
  console.log(
    '\nsce_db_setup_v0.js - The SCE Core-v4 MongoDB Schema Setup Script'
  )
  console.log('\nCommand Synopsis:')
  console.log('\t"node sce_db_setup_v0.js [option]"')
  console.log('\nOptions:')
  console.log(
    '\t--stats\n\t\tAcquires current MongoDB database statistics for the SCE database'
  )
  console.log(
    '\t--init\n\t\tThe default behavior; initializes the database to the structure described by schema_v0.js'
  )
  console.log(
    '\t--mock\n\t\tSame as the --init option, but adds numerous "fake" database documents for testing with a large database'
  )
  console.log('\t--help\n\t\tRuns this help prompt')
  console.log(
    '\t--format\n\t\tWARNING: This command does a complete wipe of the database (use only for debugging)'
  )
}
// END Utility Functions

// END sce_db_setup_v0.js
