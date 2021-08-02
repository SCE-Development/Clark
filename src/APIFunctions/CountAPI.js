/**
 * Used to process data from APIs to count and send to skylab pipeline
 */

/**
 * Creates a JSON object when an API endpoint is called
 * @param {string} name the name of the API that was called
 * @param {bool} err whether the API caused an error or not
 * @param {string} ID the ID of the user that called the function
 * @returns {object} a json object containing all the relevant raw data
*/
export async function dataAPI(name, err){
  // Where are we getting the user ID?
  let formatDay = new Date();
  let APIdate = formatDay.getFullYear()+'-'
      +(formatDay.getMonth()+1)+'-'+formatDay.getDate();

  let APItime = formatDay.getHours() + ':'
      + formatDay.getMinutes() + ':' + formatDay.getSeconds();

  const apiCountObj = {
    apiName: name,
    Error: err,
    date: APIdate,
    time: APItime,
    // userID: ID,
    description: name, // set to name to start
    Source: 'CountAPI'
  };

  // if no error
  if (!err){
    apiCountObj.description += ' completed successfully';
  } else { // if error
    apiCountObj.description += ' resulted in error';
  }

  return apiCountObj;
}

export default dataAPI;
