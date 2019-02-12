# Core-v4
The new SCE-CORE (fork from Project-MEANserver)
A web application based off of the MEAN stack for use with SCE

Current Version: Alpha (v4.0.1)

---

## Table of Contents
- [Setup and Dependencies](#setup-and-dependencies)
  - [Linux/Mac](#on-linuxmac)
  - [Windows](#on-windows)
- [Application Execution](#application-execution)
- [Directory Structure](#directory-structure)
- [System Block Diagram](#system-block-diagram)
- [Using the MEANserver](#using-the-meanserver)
  - [Endpoint Creation](#endpoint-creation)
  - [Adding Webpages](#adding-webpages)
- [Stable Endpoint Map](#stable-endpoint-map)
- [Release Notes](#release-notes)

---

## Setup and Dependencies
This project was built in the Ubuntu Xenial 16.04 LTS Linux environment, and was built on
- Node.js v8.9.1+
- ExpressJS NPM package v4.16.2+
- Body-Parser NPM package v1.18.2+
- JQuery v3.2.1+
- MongoDB Official Driver NPM package v2.2.33+
- Node Hash NPM package v0.2.0+

#### On Linux/Mac

<<<<<<< HEAD
1. In your main directory (where you can cd into desktop or documents) you can do the following: 
    - acquire **Node.js** from *nodejs.org* or through the command line using *apt-get*. 

2. Verify installation using *node -v* on command line.

3. Now install mongo in the main directory as well (locally on your machine).
  
    - Install homebrew (if on mac) ```/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"```
  
    - ```brew install mongodb```
    -  ```mkdir -p /data/db``` Use sudo in front of mkdir if necessary
4. In a new terminal window, run the mongo daemon by typing this and hit enter: ```mongod```

    If you need to exit the daemon, type ```ctrl-c``` and press enter.
  
5. In a new terminal, run the mongo shell by typing this and hit enter: ```mongo```
  
    - If you need to exit the shell, type ```quit()``` and press enter.
  
6. At this point, we assume that you already cloned the project on your local machine (if not, clone the dev branch and choose a location to put it). Example: in the documents folder.
  
7. Now go to the Core-v4 root directory of the project and run: ```npm install```
  
    - Run ```npm -v``` to find out which version.
  
8. At this point you have the repository, node.js installed and mongo installed. You have the npm packages installed which are required to trun the setup.
  
9. Go to Core-v4 folder on terminal (open a new window if you have to)
  
10. Enter this in terminal: ```cd Core-v4/util/tools```
  
    - Once there, run this: ```node system_setup.js all```
  
11. Now go to Core-v4 directory by typing this: ```cd ../..```
  
    - Once you are in Core-v4 root directory, type this: ```cd Core-v4/mdbi/tools```
  
    - Type ls and hit enter. Now you should see this: ```db_setup.js```
  
    - Run this: ```node db_setup.js --init```
  
12. Once that is complete and it shows no errors, cd back to Core-v4 repository root folder by doing this: ```cd ../..```

- Now comes the part where you have to add the mongodb admin users.

13. Close and quit the mongo shell and the mongo daemon that you have running from earlier. Instruction 4a and 5a have the commands. 
  
14. Now in 1 terminal window, run the following:
  
    - ```sudo mongod --port 27017 --dbpath /data/db```
  
    - In another terminal window, run this: mongo --port 27017
  
    - In the mongo shell prompt, run this: use admin
  
    - Then type this:
    ```
    db.createUser(
      {
        user: "admin",
        pwd: "passwordOfYourChoice",
        roles: [ { role: "userAdminAnyDatabase", db: "admin" }, "readWriteAnyDatabase" ]
      }
    )
    ```
15.


#### On Windows

  1) You should get in the habit of using linux ubuntu (or other distributions) or macOS.
  2) Install VirtualBox, VMWare, or Parallels and get a linux distribution (aka Ubuntu or other) iso image and setup your virtual environment that will run linux on your windows machine. 
  3) Once linux is setup (use youtube videos for help if you have to) then use the process defined in the section above.

  4) Although linux or MacOS is a preferred environment for this project, you can proceed with the windows with the instructions below:

    - You can install **Node.js** directly from their website using their installer. Afterwards, you can perform the same Linux/Mac verification and package installation steps (displayed above) by using Windows command prompt or PowerShell
=======
  1. In a _"main"_ directory of your choice (i.e. `cd` into `Desktop` or `Documents`), you can acquire the latest **Node.js** package in two ways:
      - **Download** from *nodejs.org*, or
      - **Install** through the command line using `apt-get` (or whatever package manager is supported by your OS, i.e. `yum`)
  2. Verify the installation succeeded using `node -v` on command line. You should see the version of your package printed out (e.g. `v10.14.2`).
  3. Acquire MongoDB in the main directory as well (locally on your machine).
      - If on mac:
        - Install Homebrew (e.g. `/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"`)
        - Use Homebrew to install MongoDB (e.g. `brew install mongodb`)
      - If on Linux or Windows:
        - Download the package from the [MongoDB website](https://www.mongodb.com/)
        - Follow your OS's installation instructions listed on the [MongoDB website](https://www.mongodb.com/)
      - After installing MongoDB, initialize your database document store by creating the `/data/db` directory
        - e.g `mkdir -p /data/db` _(Use `sudo` in front of `mkdir` if necessary)_
  4. In a new terminal window, run the mongo daemon by entering: `mongod`
      - _If you need to terminate the daemon, type `ctrl-c` and press enter_
  5. In a new terminal, run the mongo shell by entering: `mongo`
      - _If you need to exit the shell, type `quit()` and press enter_
  6. If you haven't already cloned the project on your local machine, clone the `dev` branch into a location of your choice (e.g. the `Documents` directory)
  7. Install project dependencies
      - Verify `npm` is installed using `npm -v` (should print out version info).
      - Then, go to the Core-v4 root directory of the project and run: `npm install`
  8. At this point you should have the **repository**, **Node.js**, **MongoDB** and the **Core-v4 Packages** installed. You may now run system setup.
  9. Go to the Core-v4 utility tools directory in terminal (i.e. `cd /path/to/your/.../Core-v4/util/tools`)
  10. Run the system setup script: `node system_setup.js all`
      - This script handles TLS key generation, certificate setup, security credential setup, and a check for MongoDB
  11. Go to the Core-v4 MDBI tools directory in terminal (i.e. `cd /path/to/your/.../Core-v4/mdbi/tools`)
  12. Setup the required collections for the server in one of the following ways:
      - **Create** the relevant empty collections using `node db_setup.js --init`, or
      - **Create and initialize** the relevant collections with sample data using `node db_setup.js --mock`
  13. Setup MongoDB for Authentication Mode:
      - Close the mongo shell and terminate the mongo daemon you ran from earlier _(see Instructions 4 and 5)_
      - Open a new terminal and run the mongo daemon in insecure mode using `sudo mongod`
        - If the terminal shows a missing `data/db` or port error, explicitly specify the data directory and port number by running `sudo mongod --port 27017 --dbpath /data/db`
      - In another terminal window, run the mongo shell by entering `mongo`
        - If the terminal shows a port error, explicitly specify the port number by running `mongo --port 27017`
      - In the mongo shell, enter the administrator database by entring `use admin`
      - Create a new user by using `db.createUser( ... )` as below:
        ```
        db.createUser(
          {
            user: "admin",
            pwd: "passwordOfYourChoice",
            roles: [ { role: "userAdminAnyDatabase", db: "admin" }, "readWriteAnyDatabase" ]
          }
        )
        ```
  15. Setup your local MongoDB `sce_core` database instance:
      - In the mongo shell, create an empty `sce_core` database by entering `use sce_core`
      - To maintain persistent space for the database, insert a dummy document in a dummy collection by entering `db.placeholder.insertOne({placeholder:"placeholder"})`
  16. Setup the server's MongoDB user account:
      - Close the mongo shell and terminate the mongo daemon you ran from earlier _(see Instruction 13)_
      - Open a new terminal and run the mongo daemon in authenticated mode using `sudo mongod --auth`
        - If the terminal shows a missing `data/db` or port error, explicitly specify the data directory and port number by running `sudo mongod --auth --port 27017 --dbpath /data/db`
      - In another terminal window, run the mongo shell by entering `mongo`
        - If the terminal shows a port error, explicitly specify the port number by running `mongo --port 27017`
      - In the mongo shell, enter the administrator database by entering `use admin`
      - Authenticate to the database using the credentials you created _(see Instructrion 13)_:
      ```
      db.auth( "admin", "passwordOfYourChoice" )
      ```
        - If the shell responds with `1`, authentication succeeded; otherwise, your credentials are invalid or the administrator account was not setup correctly
      - Enter the sce database by entering `use sce_core`
      - Create the `scedb` user with readWrite roles for `sce_core` _(use the mdbi password from credentials.json)_:
        ```
        db.createUser(
          {
            user: "scedb",
            pwd: "the password from credentials.json",
            roles: [ { role: "readWrite", db: "sce_core" } ]
          }
        )
        ```

#### On a Linux VM in Windows

  1. Install VirtualBox, VMWare, or Parallels
  1. Download a linux distribution (e.g. Ubuntu) iso image
  1. Setup your virtual environment to run linux on your windows machine
      - For help, there are various [online guides](www.google.com) on how to do this (Google Search is your friend)
  1. Once linux is setup, use the process defined in the section above

#### On Windows
  
  1. Although linux or MacOS is a preferred environment for this project, you can proceed with the windows with the instructions below:
      - You can install **Node.js** directly from their website using their installer. Afterwards, you can perform the same Linux/Mac verification and package installation steps (displayed above) by using Windows command prompt or PowerShell
>>>>>>> 68ad2ccf22a0722f96f5f8ad55f830035e540ab6

---

```ALL THE BELOW INSTRUCTIONS FOR APPLICATION EXECUTION ARE INCORRECT.```

## Application Execution
#### On Linux/Mac/Windows
<<<<<<< HEAD
  _**BEFORE**_ starting the server, be sure to perform necessary common resource setup described in the [Common Resources Readme](./util/common/README.md). Then, initialize the database by first starting your mongo daemon with access control enabled (see [MongoDB Authentication Guide](https://docs.mongodb.com/manual/tutorial/enable-authentication/)), and by then running the [database setup script](./mdbi/tools/sce_db_setup_v0.js) using
  ```
  //node sce_db_setup_v0.js (DONT DO THIS)
  ```
  to create the necessary collections required by the mongo database.
=======
  _**BEFORE**_ starting the server, various resources and configurations should have already been created. _**If there were no errors during system setup**_, this should have already been done for you during use of `system_setup.js` in the [Setup and Depedencies](#setup-and-dependencies) section. In the event that setup failed, attempting to start the server will result in failure, forcing you to perform some or all of these steps manually (depending on your error):

  1. Perform necessary common resource setup described in the [Common Resources Readme](./util/common/README.md).
  1. Initialize the database by configuring your mongo daemon with access control enabled (see [MongoDB Authentication Guide](https://docs.mongodb.com/manual/tutorial/enable-authentication/))
  1. Run the mongo daemon in authenticated mode using `sudo mongod --auth` _(see [System Setup](#on-linuxmac) for more details and examples)_
  1. Create the necessary collections required in the mongo database by running the [database setup script](./mdbi/tools/db_setup.js) using `node db_setup.js --mock`
>>>>>>> 68ad2ccf22a0722f96f5f8ad55f830035e540ab6

  _**On Successful Setup**_, run the server on Linux/Mac/Windows command line using
  ```
  node server.js [optional port number]
  ```
  in the project's root directory. It runs the webserver on port 8080 by default, unless the optional port number is specified. The server also checks that your MongoDB server is online before running, else it throws an error and fails startup. Make sure you have started your MongoDB server (see MongoDB's website for installation instructions relevant to your system) _**before**_ running server.js.

  Once this is done, you may simply pop open your favorite web browser and enter ```https://localhost:8080``` (or whichever port you launched the server in), and the server should properly present you with a welcome page.
  
---

## Directory Structure
#### */*
  - This directory is the project root directory, and contains the following files and folders.
    1. /log/
    1. /public/
    1. /server.js
    1. /util/
    1. /test/
    1. /mdbi/
    1. /smci/
    1. /unit-tests/
    1. /files/
#### */log/*
  - This directory contains log files generated by the server while it is running.
#### */public/*
  - This directory contains all web pages and files to be served by server.js upon request, and contains the following:
    1. skeleton/ - (used to create a new Core-v4 subapp) a subapp directory housing the minimum required set of files for a Core-v4 subapp. All other subapps are structured similarly to this directory. It takes the following structure:
       1. \*.html - any of the subapp's main html files are stored directly in the ```skeleton/``` directory
       1. css/ - a skeleton css directory, where your sub-app's css files go
       1. js/ - a skeleton javascript directory, where your sub-app's js files go
       1. img/ - a skeleton image/graphics directory, where your sub-app should look for image content
    1. lib/ - (optional) a directory containing core or common front-end files and resources (i.e. fonts, common utilties, and common angular components). It contains the following directories:
       1. components/ - houses various common angularjs components
       1. fonts/ - a collection of common font files that can be used to style your webpage
       1. utility.js - a set of handy utility functions commonly used by your subapp's html pages and javascript files.
    1. home/ - the server root's home directory, containing the main subapp and front-facing homepage files. In addition to what's inside ```skeleton/```, it contains the following:
       1. index.html - the Core-v4 front-facing homepage (i.e. sce.engr.sjsu.edu front page)
       1. test.html - the html file comprising the Core-v4 test application. This is the html file served the the **/test/** directory described later below.
       1. genErr.html - a general error page that is presented when a client request results in an error (typically used for 404:NOT_FOUND errors).
    1. core/ - the Core-v4 administrator portal's subapp. In addition to what's inside ```skeleton/```, it contains the following:
       1. core.html - the Core-v4 administrator portal (login) page
       1. dashboard.html - the Core-v4 administrator dashboard page
       1. app/ - contains the Core-v4 Admin Portal ExpressJS subapp files "app.js" and "routes/index.js" for endpoint routing
       1. components/ - contains various AngularJS components exclusively used by the Core-v4 Admin Portal.
  - Any added HTML files can go directly in /public
#### */server.js*
  - This file comprises the MEAN stack webserver that will be serving all requests with the relevant endpoints.
#### */util/*
  - This directory contains various utility files for server.js, and includes
    1. settings.js - file containing core server settings
    1. logger.js - a server utility that allows server.js to log various events to logfiles in the /log/ directory
    1. route_handlers.js - a collection of endpoint handler callbacks to service the different requests coming to the server for various endpoints.
    1. www.js - a collection of https request method wrappers designed to perform HTTPS web reqeuests and configuration in a consistent manner.
    1. error_formats.js - a collection of common error decription utilities and objects (dubbed error_format objects) designed to provide meaningful error responses to various server faults in a consistent manner.
    1. datetimes.js - a set of custom datetime comparison tools (primarily for verifying a session token's validity or expiration)
    1. cryptic.js - a set of custom encryption function wrappers (primarily for password and session token hashing)
    1. common/ - a directory housing various resources commonly required by many of the server subapps and modules (including, but not limited to, security-related items)
#### */test/*
  - This directory contains a MongoDB Test Interface App used for testing basic database transactions. Previously routed within route_handlers.js, the Test Interface is now housed in its own app to be used as a sub-app by server.js. The following files are contained within it:
    1. app.js - the ExpressJS sub-app that links all requests to the "/test" endpoint
    1. testRoutes/index.js - the ExpressJS router that routes all "/test" endpoint requests
#### */mdbi/*
  - This directory comprises the sub-app that handles all MongoDB database transactions. Previously housed within route_handlers.js, all database-related functions are now abstracted into here. See the internal README for more details on relevant database access endpoints. The following files are contained within it:
    1. app.js - the ExpressJS sub-app that links all requests to the "/mdbi" endpoint
    1. mdbiRoutes/index.js - the ExpressJS router that routes all "/mdbi" endpoint requests (i.e. database CRUD operations) to their relevant handlers.
    1. mongoWrapper.js - the collection of all MongoDB NodeJS Driver API wrapper functions that perform all database transactions for the main server and all other sub-apps that require database access.
    1. mongo_settings.js - a set of MongoDB client configuration parameters used by the MDBI to establish database connections.
    1. tools/ - a directory containing various database configuration tools (i.e. an initial database setup script, initial database schema, etc.)
    1. README - An internal readme describing the MDBI module.
#### */smci/*
  - This directory contains the SMCI module, a set of api wrappers for MailChimp using their REST-ful apis. All transactions to MailChimp are performed by this module, either as a stand-alone include or as an ExpressJS sub-app (much like the mdbi; this is the intended use). See the internal README for more details on relevant api wrappers and their associated endpoints. The following files are contained within it:
    1. smci.js - the collection of MailChimp api wrapper functions
    1. smci_settings.js - settings used to associate the SMCI module with a MailChimp account, enabling granting access to their services via the wrapper functions
    1. README - an internal readme describing the SMCI module
#### */unit-tests/*
  - This directory houses any unit tests that were required for testing the individual modules. Unit testing was done using the Mocha/Chai unit-testing framework
#### */files/*
  - This directory includes various documentation-related files and images, and doesn't provide any particular function affecting the server or its use.

---

## System Block Diagram

![System Block Diagram v4.0.1](https://github.com/SCE-Development/Core-v4/blob/rj/httpsConfig/files/Core%20v4%20System%20Block%20Diagram.png)

---

## Using the MEANserver
#### Endpoint Creation
  - Endpoints are declared in **server.js**. To create an endpoint having a URI of "*/someEndpoint*", the express.js **app.get()** or **app.post()** methods can be used (depending on your desired request type). By using one of these methods, you can effectively associate an endpoint name (i.e. "*/someEndpoint*") with a handler function to service any requests to it. The available handler functions are imported from the **handle_map** object within **route_handlers.js**. Let's assume that you expect this endpoint to receive POST requests. Therefore, after creating a handler function "*someEndpointHandler*" in the **handle_map** to service your request, associating it is simply done in **server.js** using the line
  ```javascript
  app.post("/someEndpoint", handles.someEndpointHandler);
  ```
#### Adding Webpages
  - You can add new webpages to the server by first assigning an endpoint to serve the page (see the **Endpoint Creation** section for more details). Afterwards, you can place your webpage files in the relevant sections of the **/public** directory.

---

## Stable Endpoint Map
#### Description
  - This section lists and describes the **stable** endpoints (i.e. whose functions and endpoint names are not expected to change by much within the near future). All webpages within the server can use these endpoints to perform their designated functions.

#### Endpoints
###### "/" - Root
  - Serves requests going out to the server root (i.e. localhost:8080, if using default settings)

###### "/login" - Service Login (Coming Soon)
  - This endpoint services any login POST requests and expects the {TBD} JSON object to be passed via the request header's data section. This can be done using **utility.js**'s **post()** function (or JQuery.ajax() if you know how to use it).

###### "/test" - MongoDB Test Interface
  - This endpoint provides access to a test page that tests basic CRUD operations with the MDBI sub-app. Used for development and testing purposes only, it will be _**disabled**_ in the production version.

###### "/mdbi" - MongoDB Interface Module
  - This endpoint provides restricted access to the MongoDB Database used by Core-v4. See the MDBI readme for more information on the subapp's available endpoints.

###### "/core" - Core-v4 Admin SubApp
  - This endpoint provides access to the Core-v4 Admin portal and dashboard subapp.

---

## Release Notes
- Alpha
  - Working to modularize the system by abstracting distinct system functions (listed below) into their own sub-apps to be managed by server.js:
    1. ~MDBI~ (_completed_)
    1. SMCI (partially completed, but stalled)
    1. Core Services (currently under development)
    1. Core Home
  - Developing the SCE Core Services application (Admin portal/dashboard, and officer tools)
    1. ~Portal Login~ (_completed_)
    1. ~Session Token distribution upon login~ (_completed_)
    1. ~Implement Session Expiration~ (_complete_)
    1. ~Member Approval (a.k.a. adding members who have registered)~ (_completed_)
    1. Member Editing (in progress)
    1. Officer Approval
    1. Officer Capability Modification
  - ~Developing an error message protocol to force all modules to conform to a common error message standard~ (_completed with error_formats.js_)
  - ~Adding various database tools (i.e. db setup script, db mock data insertion, etc.)~ (_completed_)
  - Need to add Database Schema constraints to enforce BSON document conformity per collection
  - Need to integrate Core Printer Service Project to this application
  - Need to integrate SCE POS System Project to this application (postponed)
