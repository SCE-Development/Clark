# SMCI
The Sce Mail Chimp Interface. 

---

## Table of Contents
- [Description](#description)
- [Dependencies](#dependencies)
- [Sub-Module Reference](#sub-module-reference)
  - [smci.api](#smci.api)

---

## Description
  The SCE MailChimp Interface is used to send campaign emails to the SCE organization's various members. It is intended to work with the MailChimp Forever Free Plan, which allows no more than 2000 subscribers across all subscriber lists, and permits 2000 emails within any 24-hour period, for a maximum of 12,000 sends per month.

  The SMCI module is intended for use as a sub-app by the main server in server.js (i.e. the suggested use), but is a stand-alone module and can be used directly by software without going through a sub-app's restful endpoints. It is split into 9 sub-modules that manage different elements of the MailChimp Mailing Service (described by the Forever Free Plan, above), each with their own api wrappers.

---

## Dependencies
- NodeJS v8.9.1 and up (querystring module)
- /util/www (Core-v4 custom https request wrappers)
- /util/settings.js (Core-v4 server system settings)

---

## Sub Module Reference
  Below is the documentation for all MailChimp API Wrappers organized into 9 sub-modules included in the SMCI module. Those listed with a _**stable**_ status are functions that are "stable", meaning that they are not expected to undergo drastic changes in the near future.

### smci.api
  The API module, which includes api wrappers for 
