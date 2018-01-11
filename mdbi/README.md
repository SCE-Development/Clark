# MDBI: MongoDB Interface
  This directory houses the MDBI module used as an ExpressJS sub-app by server.js (and all other sub-apps) to issue MongoDB database transactions. It was created within Core-v4's rj/systemRefit branch in an effort to abstract various functions away from each other, with the goal of better-structuring system software to a point where each system is individually maintainable and somewhat stand-alone. All database CRUD transactions can be performed through this sub-app via the "/mdbi/*" endpoint, where "*" is any one of the endpoints described in the Stable Endpoint Map Below.

---

### Stable Endpoint Map
  Below is a list of **_stable_** endpoints for the MDBI module (accessed using the "/mdbi" endpoint. **_Stable_** is used to define an endpoint whose functionality is not subject to much change in the near future. The endpoints below perform database CRUD operations, currently providing _unsrestricted_ access to the Core v4 System's MongoDB database (plans for securing the database are being developed).

  - **/write** - performs a database write to the db for all "/mdbi/write" endpoint requests. Used with a POST request, it requires that the request body be a JSON object in the following format:
    ```javascript
        {
            "collection": "string name of collection",
            "data": {...}
        }
    ```
    where the "data" parameter is a JSON object containing the doc parameter expected by the mdb.insertDoc() function. Read the mdb.insertDoc() description (in mongoWrapper.js) for more details on what to give the "data" parameter.


  - **/search/collections** - performs a database query to the db for all "/mdbi/search/collections" endpoint requests. Used with a POST request, it queries the database for any collections matching the search parameters given in the request body's JSON data. This data is expected to appear in the following format:
    ```javascript
        {
            "name": "string of the collection name to find"
        }
    ```
    If this data is given, MDBI will search for (and return in its response) the collection whose name matches the object's "name" member.
    If this data is not given (i.e. a `null` is given instead of the JSON object in the request body), MDBI will return a list of all collections in the database.
