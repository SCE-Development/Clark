# Core-v4 Common Resources
A directory housing all common resources required by the server and all sub-apps

---

## Table of Contents
- [Description](#description)
- [Required Setup](#requiredsetup)
  - [credentials.json](#credentialsjson)
    - [Credentials Setup](#credentials-setup)

---

## Description

This directory is primarily used to store system credentials (i.e. to allow db admin access). The following files need to be placed in this directory _**BEFORE**_ starting the MEANserver:

  - credentials.json

Read each files' setup instructions for detailed procedures on setting up both the files themselves and the modules they pertain to.

---

## Required Setup

### credentials.json

This file contains all credentials necessary for the entire system to function properly. The elements currently required in the file pertain to the MDBI module (i.e. db access credentials) and the sce admin portal (i.e. sce admin portal master key). By default, the repository does not come with this file included, and must therefore be created manually. Below are setup instructions used to properly create the credentials.json file and associate all credentials to their relevant systems (assumes you are using Ubuntu Linux).

#### Credentials Setup