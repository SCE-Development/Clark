# Core-v4
The new SCE-CORE (fork from Project-MEANserver)
A web application based off of the MERN stack for use with SCE

Current Version: Alpha (v4.0.2)

---

## Table of Contents
- [Setup and Dependencies](#setup-and-dependencies)
- [Directory Structure](#directory-structure)
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

#### On Mac/Linux/Windows
  1. In a _"main"_ directory of your choice (i.e. `cd` into `Desktop` or `Documents`), you can acquire the latest **Node.js** package in two ways:
      - **Download** from *nodejs.org*, or
      - **Install** through the command line using `apt-get` (or whatever package manager is supported by your OS, i.e. `yum`)
      - Verify the installation succeeded using `node -v` on command line. You should see the version of your package printed out (e.g. `v10.14.2`).
  2. (MacOS/Linux) Install Homebrew (e.g. `/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"`)
      - After installing, upgrade existing packages by running the command: `brew upgrade && brew update`
  3. Acquire MongoDB in the main directory as well (locally on your machine).
      - MacOS/Linux:
        - Use Homebrew to install MongoDB:
          - `brew tap mongodb/brew`
          - `brew install mongodb-community`
      - Windows:
        - Download and install the package from the [MongoDB website](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/)
        - Follow your OS's installation instructions listed on the [MongoDB website](https://www.mongodb.com/)
  4. After installing MongoDB, initialize your database document store by creating the `/data/db` directory
      - MacOS/Linux:
        - `sudo mkdir -p /data/db` _(Use `sudo` in front of `mkdir` if necessary)_
        - ``sudo chown -R `id -un` /data/db`` _(Use `sudo` in front of `chown` if necessary)_
      - Windows:
        - `cd C:\`
        - `md "\data\db"`
  5. If you haven't already cloned the project on your local machine, clone the `dev` branch into a location of your choice (e.g. the `Documents` directory):
      - `git clone https://github.com/SCE-Development/Core-v4`
  6. Create your own branch to work off of:
      - `git checkout -b [name]`
  7. Go to the root directoery of the project (i.e. `cd /path/to/your/.../Core-v4/`
  8. Install the node dependencies: `npm install`
  9. In a new terminal window, run the mongo daemon by entering:
      - MacOS/Linux:
        - `mongod`
        - _If you need to terminate the daemon, type `ctrl-c` and press enter_
      - Windows:
        - `"C:\Program Files\MongoDB\Server\4.2\bin\mongod.exe" --dbpath="c:\data\db"`
  10. Run the app in the root project directory using: `npm start`
      - The app should automatically run on port 3000 and 8080 and open in your default browser

#### Set up mailer
  1. Move config.example.js to config.js in /api/config/
  1. Obtain the client secret and ID keys from [https://console.cloud.google.com/](https://console.cloud.google.com/) under the API Credentials section
  1. Login into the Oauth2 playground at: https://developers.google.com/oauthplayground/
  1. Select GMAIL API v1 -> https://mail.google.com and press Authorize APIs. It will prompt you to login to the sce.sjsu@gmail.com to authorize the API
  1. When the view changes to the second step, click the gear icon and then the checkbox for "Use your own auth credentials"
  1. Paste in the client ID and client secret and submit it
  1. Copy the Refresh Token into the REFRESH_TOKEN area in config.js
  1. In a terminal window use the command `npm run build && NODE_ENV=production node server.js`
  1. A link will be pasted into the terminal output above the logger information, open the URL in a browser
  1. Copy the Authorization code listed on the URL after logging in to the sce.sjsu@gmail.com account and paste it into the terminal window
  10. A token.json file should be created under /api/config/ and you're now good to go

- Note: you need access into the sce.sjsu@gmail.com email account in order to set this up.
- Note: If you need to repeat this process, delete any existing token.js file.

#### On a Linux VM in Windows

  1. Install VirtualBox, VMWare, or Parallels
  1. Download a linux distribution (e.g. Ubuntu) iso image
  1. Setup your virtual environment to run linux on your windows machine
      - For help, there are various [online guides](www.google.com) on how to do this (Google Search is your friend)
  1. Once linux is setup, use the process defined in the section above

#### On Windows

  1. Although linux or MacOS is a preferred environment for this project, you can proceed with the windows with the instructions below:
      - You can install **Node.js** directly from their website using their installer.

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
