// PROJECT:   Core-v4
//  Name:    Rolando Javier
//  File:    mongo_settings.js
//  Date Created:  January 22, 2018
//  Last Modified:  January 22, 2018
//  Details:
//      This file contains the default settings associated with the SCE Mongo Database
//  Dependencies:
//      [Dependencies]

'use strict'

// Container (Singleton)
const mongoSettings = {}

// BEGIN members
/*
 @member  hostname
 @details  The string name of the host running the database
*/
// mongo_settings.hostname = "db";
mongoSettings.hostname = 'localhost'
/*
 @member  port
 @details  The string representing the port number where the mongo daemon is listening in
*/
mongoSettings.port = '27017'

/*
 @member  database
 @details  The string name of the database to connect to
*/
mongoSettings.database = 'sce_core'
// END members

// Freeze object
Object.freeze(mongoSettings)

module.exports = mongoSettings

// END mongo_settings.js
