# MDBI: MongoDB Interface
  This directory houses the MDBI module used as an ExpressJS sub-app by server.js (and all other sub-apps) to issue MongoDB database transactions. It was created within Core-v4's rj/systemRefit branch in an effort to abstract various functions away from each other, with the goal of better-structuring system software to a point where each subsystem is individually maintainable and expandable. All database CRUD transactions can be performed through this sub-app via the "/mdbi/\*" endpoint, where "\*" is any one of the endpoints described in the Stable Endpoint Map below.


---


## Table of Contents
- [Stable Endpoint Map](#stable-endpoint-map)
  - [/write](#write)
  - [/search/collections](#searchcollections)
  - [/search/documents](#searchdocuments)
  - [/search/aggregation](#searchaggregation)
  - [/delete/document](#deletedocument)
  - [/delete/documents](#deletedocuments)
  - [/update/documents](#updatedocuments)

---


## Stable Endpoint Map
  Below is a list of **_stable_** endpoints for the MDBI module (accessed using the "/mdbi" endpoint). **_Stable_** is used to define an endpoint whose functionality is not subject to much change in the near future. The endpoints below perform database CRUD operations, currently providing _unrestricted_ access to the Core v4 System's MongoDB database (plans for securing the database are being developed).

### /write
- _**endpoint**_ 	write
- _**parameter**_	request - the web request object provided by express.js
- _**parameter**_	response - the web response object provided by express.js
- _**returns**_	To Client: If successful, returns a success status (200). If access authentication fails, returns a server error 499 and a JSON description of the error. Otherwise, returns a server error status (500) and populates the reponse header with the error's details (i.e. an error_formats object)
- _**details**_ 	This function performs a database write to the db for all "/mdbi/write" endpoint requests. Used on a POST request, it requires that the Request body be a JSON object in the following format:
  ```javascript
  {
    "accessToken": "access token string",
  	"collection": "string name of collection",
  	"data": {...}
  }
  ```
  where the "accessToken" parameter is the string access token located in credentials.json for security purposes (i.e. enforces local-only db access), and the "data" parameter is a JSON object containing the doc parameter expected by the insertDoc() function. Read the insertDoc() description for more deatils on what to give to the "data" parameter.

### /search/collections
- _**endpoint**_ 	search/collections
- _**parameter**_	request - the web request object provided by express.js
- _**parameter**_	response - the web response object provided by express.js
- _**returns**_	To Client: If successful, returns a success status (200) and the list of collections found. If access authentication fails, returns a server error 499 and a JSON description of the error. Otherwise, returns a server error status (500) and populates the response header with the error's details
- _**details**_ 	This function serves any and all requests to the "/mdbi/search/collections" endpoint by performing a search of any collections matching the search parameters given in the request body's JSON data. This data is exepected to appear in the following format:
  ```javascript
  {
    "accessToken": "access token string",
    "name": "string of the collection name to find"
  }
  ```
	Where "accessToken" is the string access token located in credentials.json for security purposes (i.e. enforces local-only db access). If this data is given, the function will search for the collection whose name matches the object's "name" member.
	If the data field is not given (i.e. instead of a JSON object in the Request body, we have null), the function will return a list of all collections

### /search/documents
- _**endpoint**_ 	search/documents
- _**parameter**_	request - the web request object provided by express.js
- _**parameter**_	response - the web response object provided by express.js
- _**returns**_	To Client: If successful, returns a success status (200) and the list of documents found. If access authentication fails, returns a server error 499 and a JSON description of the error. Otherwise, returns a server error status (500) and populates the response header with the error's details
- _**details**_ 	(Intended for use in testing the database querying functions) This function handles all endpoint requests to the "/mdbi/search/documents" endpoint. It performs a query on the database and returns any results matching the search criteria given by the Request header's data field. The data field is expected to be a JSON object in the following format:
  ```javascript
  {
	"accessToken": "access token string",
	"collection": "string name of collection",
	"search": {...},
	"options": {...}
  }
  ```
	where "accessToken" is the string access token stored in credentials.json for security purposes (i.e. enforces local-only db access), the "search" parameter is a JSON object containing the search parameters expected by the findDocs() function (read the findDocs() description for more details on what to give to the "search" parameter), and the "options" parameter is an optional object containing result set formatting options.
	The "options" parameter can contain any of the following:
  ```javascript
  {
	"projection": {...},	// a MongoDB Projection Specifier Object
	"limit": ...,			// the max number of results you want back
	"page": ...,			// the current page of results to return
	"sort": {				// an object specifying fields to sort by
		"asc": [...],		// specifies fields to sort in ascending order
		"desc": [...]		// specifies fields to sort in descending order
	}
  }
  ```

### /search/aggregation
- _**endpoint**_ 	search/aggregation
- _**parameter**_	request - the web request object provided by express.js
- _**parameter**_	response - the web response object provided by express.js
- _**returns**_ 	To Client:
				On success, a success status code (200) and the list (array) of documents resulting from the aggregation
				On invalid/expired access token, a client error code (499) and a JSON description of the error
				On invalid parameter(s), a client error code (499) and a JSON description of the error
				On any other error, an internal server error code (500) and a JSON description of the error
- _**details**_ 	This function handles all endpoint POST requests to the "mdbi/search/aggregation" endpoint. It performs a query with the given parameters, but contrary to the "mdbi/search/documents" endpoint handler, it uses the MongoDB aggregation pipeline to do so. The request header's data field is expected to be a JSON object with the following format:
    ```javascript
    {
			"accessToken": "access token string",
			"collection": "string name of collection",
			"pipeline": "array of MongoDB Aggregation Command Specifiers",
			"agOptions": "(optional) array of MongoDB Aggregation Options"
		}
    ```
- _**note**_ 		This function gives the end user complete control over how the results are processed, filtered, and returned, but requires knowledge of how to properly use MongoDB's aggregation syntax and semantics. See MongoDB's Aggregation article and API documentation for details on what to give to the "pipeline" and "agOptions" parameters

### /delete/document
- _**endpoint**_ 	delete/document
- _**parameter**_	request - the web request object provided by express.js
- _**parameter**_	response - the web response object provided by express.js
- _**returns**_ 	To Client: If successful, returns a success status (200) and an object detailing the result of the operation. If access authentication fails, returns a server error 499 and a JSON description of the error. Otherwise, returns a server error status (500) and populates the response header with the error's details
- _**details**_ 	(Intended for use in testing the database single-deleting function) This function handles all endpoint requests to the "/mdbi/delete/document" endpoint. It performs a deletion request to the database using the Request header's data field as search criteria to select which document to delete. The data field is expected to be a JSON object with the following format:
    ```javascript
		{
			"accessToken": "access token string",
			"collection": "string name of collection",
			"search": {...}
		}
    ```
	where "accessToken" is the string access token stored in credentials.json for security purposes (i.e. enforces local-only db access), and the "search" parameter is a JSON object containing the search parameters expected by the deleteOneDoc() function. Read the deleteOneDoc() description for more details on what to give the "search" parameter

### /delete/documents
- _**endpoint**_ 	delete/documents
- _**parameter**_	request - the web request object provided by express.js
- _**parameter**_	response - the web response object provided by express.js
- _**returns**_ 	To Client: If successful, returns a success status (200) and an object detailing the result of the operation. If access authentication fails, returns a server error 499 and a JSON description of the error. Otherwise, returns a server error status (500) and populates the response header with the error's details
- _**details**_ 	(Intended for use in testing the database multi-deleting function) This function handles all endpoint requests to the "/mdbi/delete/documents" endpoint. It performs a deletion request to the database using the Request header's data field as search criteria to select which document to delete. The data field is expected to be a JSON object with the following format:
    ```javascript
    {
			"accessToken": "access token string",
			"collection": "string name of collection",
			"search": {...}
		}
    ```
	where "accessToken" is the string access token stored in credentials.json for security purposes (i.e. enforces local-only db access), and the "search" parameter is a JSON object containing the search parameters expected by the deleteManyDocs() function. Read the deleteManyDocs() description for more details on what to give the "search" parameter

### /update/documents
- _**endpoint**_ 	update/documents
- _**parameter**_	request - the web request object provided by express.js
- _**parameter**_	response - the web response object provided by express.js
- _**returns**_ 	To Client: If successful, returns a success status (200). If access authentication fails, returns a server error 499 and a JSON description of the error. Otherwise, returns a server error status (500) and populates the response header with the error's details
- _**details**_ 	(Intended for use in testing the database single-update function) This function handles all endpoint requests to the "/mdbi/update/documents" endpoint. It performs an update request to the database using the Request header's data field as search criteria to select which document to update. The data field is expected to be a JSON object with the following format:
    ```javascript
    {
			"accessToken": "access token string",
			"collection": "string name of collection",
			"search": {...},
			"update": {...}
		}
    ```
	where "accessToken" is the string access token stored in credentials.json for security purposes (i.e. enforces local-only db access), the "search" parameter is a JSON object containing the filter parameters expected by the updateOneDoc() function, and "update" is a JSON object containing the update commands expected by the updateOneDoc() function. Read the updateOneDoc() description for more details on what to give the "search" parameter
