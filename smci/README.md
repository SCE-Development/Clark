# SMCI
The Sce Mail Chimp Interface. 

---

### Table of Contents
- [Dependencies](#dependencies)
- [Description](#description)
- [API Wrapper Reference](#api-wrapper-reference)
  - [smci.api](#smciapi)
    - [api.getRoot()](#apigetroot)
    - [api.ping()](#apiping)
  - [smci.authorizedApps](#smciauthorizedapps)
  - [smci.automations](#smciautomations)
  - [smci.batchOps](#smcibatchops)
  - [smci.campaignFolders](#smcicampaignfolders)
  - [smci.campaigns](#smcicampaigns)
  - [smci.lists](#smcilists)
  - [smci.templateFolders](#smcitemplatefolders)
  - [smci.templates](#smcitemplates)

---


# Dependencies
- NodeJS v8.9.1 and up (querystring module)
- /util/www (Core-v4 custom https request wrappers)
- /util/settings.js (Core-v4 server system settings)
- MailChimp API 3.0

---

# Description
  The SCE MailChimp Interface is used to send campaign emails to the SCE organization's various members. It is intended to work under the MailChimp Forever Free Plan, which allows no more than 2000 subscribers across all subscriber lists, and permits 2000 emails within any 24-hour period, for a maximum of 12,000 sends per month.

  The SMCI module is intended for use as an ExpressJS sub-app by the main Node/Express (MEAN stack) server in server.js (i.e. the suggested use), but is a stand-alone module that can be used directly by software without going through a sub-app's restful endpoints. It is split into 9 categories that manage different elements of the MailChimp Mailing Service (described by the Forever Free Plan, above), each with their own RESTFUL api wrappers. 

Below is the documentation for all SMCI MailChimp API Wrappers organized into their 9 categories (i.e. sub-modules of the SMCI). Though these API wrappers provide software applications 

  Categories listed with a _**stable**_ status are "stable", meaning that they are not expected to undergo drastic changes in the near future.

  Categories listed with a _**pending**_ status are "pending", meaning that they may be completely developed but lack proper testing and should be used with caution (if at all).

---

# API Wrapper Reference

## smci.api  
  The API module, which includes api wrappers for pinging the API health and retreiving the API root directory.

#### api.getRoot
  - _**parameter**_ qsObj
    
    the JSON object representing the request's query string parameters expected by the MailChimp GET / api. MailChimp uses these parameters to determine how to format its response. If no particular control over the response is desired, this parameter can be passed "null". Otherwise, the object can contain any or all of the following:
    ```javascript
    {
        "fields": "...",
        "exclude_fields": "..."
    }
    ```
		
    where "fields" is a comma-separated list of fields to include in the response, and "exclude_fields" is a comma-separated list of fields to omit in the response. Read the MailChimp API reference for more details on the above query string parameters.

  - _**parameter**_ callback
  
    a callback function to run after the request is issued. It is passed two arguments:
      "response" - the response object from MailChimp
		  "error" - any error(s) that occurred while processing the request
    The values of the "error" and "response" arguments vary depending on the result of the request.
  	On success: "error" is null, and "response" is the JSON response object returned from MailChimp.
    On failure: "error" is the object returned by the NodeJS https.get() function's "error" event, and "response" is null.

  - _**returns**_
    
    n/a
  
  - _**details**_ 
    
    This function makes a GET request to the MailChimp API Root using the NodeJS https.get() api.

#### api.ping

  - _**parameter**_ callback
  
    a callback function to run after the request is issued. It is passed two arguments:
      "response" - the response object from MailChimp
      "error" - any error(s) that occurred while processing the request
    The values of the "error" and "response" arguments vary depending on the result of the request.
		On success: "error" is null, and "response" is the JSON response object returned from MailChimp.
    On failure: "error" is the object returned by the NodeJS https.get() function's "error" event, and "response" is null.

  - _**returns**_

    n/a
	
  - _**details**_
  
    This function makes a GET request to the MailChimp GET /ping api using the NodeJS https.get() api.

## smci.authorizedApps
  The Authorized Apps module, responsible for granting external applications access to the associated Mail Chimp Account's email api. This would be useful for registering any custom applications external to the SMCI with the associated Mail Chimp Account's email system (thereby permitting email system control), or in cases where use of the owner's API keys is not recommended.

## smci.automations
  The Automations module, a free MailChimp tool that allows the creation and management of a set of emails to be sent by some triggering event (i.e. a time, date, or activity).

## smci.batchOps
  The Batch Operations module, useful for performing multiple MailChimp operations with a single api call.

## smci.campaignFolders
  The Campaign Folder Management module, responsible for creating, deleting, and editing email campaign folders and their settings. This is useful for organizing your campaign emails into sets of your choosing.

## smci.campaigns
  The Email Campaign Management module, useful for creating, deleting, and editing campaign emails and their settings. This is the primary API used to send emails to SCE members.

## smci.lists
  The Mailing List Management module, useful for creating mailing lists to associate to campaigns. This is the primary API used to join SCE members' email addresses to campaign emails.

## smci.templateFolders
  The Template Folder Management module, responsible for creating, deleting, and editing email template folders and their settings. This is useful for organizing your custom email templates into categories of your choosing.

## smci.templates
  The Email Template Management module, useful for creating, deleting, and editing email templates created by you or by MailChimp under their default templates selection. This is the primary API used to create custom email bodies with the SCE logo and style. However, care needs to be taken to adhere to MailChimp's formatting guidelines, since there are legally-binding guidelines at stake here.
