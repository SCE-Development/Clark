# MDBI: MongoDB Interface
  This directory houses the MDBI module used as an ExpressJS sub-app by server.js (and all other sub-apps) to issue MongoDB database transactions. It was created within Core-v4's rj/systemRefit branch in an effort to abstract various functions away from each other, with the goal of better-structuring system software to a point where each subsystem is individually maintainable and expandable. All database CRUD transactions can be performed through this sub-app via the "/mdbi/\*" endpoint, where "\*" is any one of the endpoints described in the Stable Endpoint Map below.


---


## Table of Contents
- [Stable Endpoint Map](#stable-endpoint-map)
  - [/write](#write)
  - [/search/collections](#searchcollections)
  - [/search/documents](#searchdocuments)
  - [/delete/document](#deletedocument)
  - [/delete/documents](#deletedocuments)
  - [/update/documents](#updatedocuments)

---


## Stable Endpoint Map
  Below is a list of **_stable_** endpoints for the MDBI module (accessed using the "/mdbi" endpoint). **_Stable_** is used to define an endpoint whose functionality is not subject to much change in the near future. The endpoints below perform database CRUD operations, currently providing _unrestricted_ access to the Core v4 System's MongoDB database (plans for securing the database are being developed).

### /write
  Performs a database write to the db for all "/mdbi/write" endpoint requests. Used with a POST request, it requires that the request body be a JSON object in the following format:
  ```javascript
      {
          "collection": "string name of collection",
          "data": {...}
      }
  ```
  where the "data" parameter is a JSON object containing the doc parameter expected by the mdb.insertDoc() function. Read the mdb.insertDoc() description (in mongoWrapper.js) for more details on what to give the "data" parameter.
  If successful, it returns a success status (200) to the client.
  If unsuccessful, it returns an internal server error status (500) and populates the response header with the error's details.

### /search/collections
  Performs a database query to the db for all "/mdbi/search/collections" endpoint requests. Used with a POST request, it queries the database for any collections matching the search parameters given in the request body's JSON data. This data is expected to appear in the following format:
  ```javascript
      {
          "name": "string of the collection name to find"
      }
  ```
  If this data is given, MDBI will search for (and return in its response) the collection whose name matches the object's "name" member. If this data is not given (i.e. a `null` is given instead of the JSON object in the request body), MDBI will return a list of all collections in the database.
  If successful, it returns a success status (200) to the client, along with a list of all collections found (that match the search criteria).
  If unsuccessful, it returns an internal server error (500) to the client, and populates the response header with the error's details.

### /search/documents
  Performs a database query to the db for all "/mdbi/search/documents" endpoint requests. Used with a POST request, it queries the database for any documents matching the search criteria given by the request header's data field, which is expected to be a JSON object with the following format:
  ```javascript
      {
          "collection": "string name of collection",
          "search": {...}
      }
  ```
  where the "search" parameter is a JSON object containing the search parameters expected by the mdb.findDocs() function. Read the mdb.findDocs() description (in mongoWrapper.js) for more details on what to give the "search" parameter.
  If successful, it returns a success status (200) to the client, and a list of all matching documents found.
  If unsuccessful, it returns an internal server error status (500) to the client, and populates the response header with the error's details.

### /delete/document
  Performs a db deletion operation of a single document for all "/mdbi/delete/document" endpoint requests. Used with a POST request, it performs the deletion using the request header's data field as search criteria to determine which document to delete. The data field is expected to be a JSON object with the following format:
  ```javascript
      {
          "collection": "string name of collection",
          "search": {...}
      }
  ```
  where the "search" parameter is a JSON object containing the search parameters expected by the mdb.deleteOneDoc() function. Read the mdb.deleteOneDoc() description (in mongoWrapper.js) for more details on what to give the "search" parameter.
  If successful, it deletes the **first** document matching the search criteria, returns a success status (200) to the client, and also returns an object detailing the result of the operation.
  If unsuccessful, it returns an internal server error status (500) to the client, and populates the response header with the error's details.

### /delete/documents
  Performs a db deletion operation of many documents for all "/mdbi/delete/documents" endpoint requests. Used with a POST request, it performs the deleteion using the request header's data field as search criteria to select which documents to delete. The data field is expected to be a JSON object with the following format:
  ```javascript
      {
          "collection": "string name of collection",
          "search": {...}
      }
  ```
  where the "search" parameter is a JSON object containing the search parameters expected by the mdb.deleteManyDocs() function. Read the mdb.deleteManyDocs() description (in mongoWrapper.js) for more details on what to give the "search" parameter.
  If successful, it returns a success status (200) to the client, and an object detailing the result of the operation.
  If unsuccessful, it returns an internal server error (500) to the client, and populates the response header with the error's details.

### /update/documents
  Performs a db update operation of (currently) a single document for all "/mdbi/update/documents" endpoint requests. Used with a POST request, it performs the update using the request header's data field as search criteria to select which document to update. The data field is expected to be a JSON object with the following format:
  ```javascript
      {
          "collection": "string name of collection",
          "search": {...},
          "update": {...}
      }
  ```
  where the "search" parameter is a JSON object containing the filter parameters expected by the mdb.updateOneDoc() function, and "update" is a JSON object containing the update commands expected by the same function. Read the mdb.updateOneDoc() description (in mongoWrapper.js) for more details on what to give the "search" and "update" parameters.
  If successful, it returns a success status (200).
  If unsuccessful, it returns an internal server error status (500), and populates the response header with the error's details.
