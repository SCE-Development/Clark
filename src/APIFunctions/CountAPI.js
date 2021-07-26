/** 
 * Used to process data from APIs to count and send to skylab pipeline 
 */

//TODO: What imports are needed?

/** 
 * Creates a JSON object when an API endpoint is called 
 * @param {string} name the name of the API that was called
 * @param {bool} err whether the API caused an error or not 
 * @param {string} ID the ID of the user that called the function
 * @returns {object} a json object containing all the relevant raw data 
*/
export async function dataAPI(name, err, ID){ //TODO: Remove description from all files where this is used so far, change 'returns' param
    //find a way to catch the current date and time when this function is called 
    let formatDay = new Date(); 
    let APIdate = formatDay.getFullYear()+'-'+(formatDay.getMonth()+1)+'-'+formatDay.getDate();

    let APItime = formatDay.getHours() + ":" + formatDay.getMinutes() + ":" + formatDay.getSeconds();

    const apiCountObj = {
        api_name: name, 
        Error: err, 
        date: APIdate, 
        time: APItime, 
        userID: ID, 
        description: name, //set to name to start
        Source: "CountAPI"
    };   

    //if no error
    if (!err){
        apiCountObj.description += " completed successfully";
    } else { //if error
        apiCountObj.description += " resulted in error"; 
    }

    return apiCountObj;
    //TODO: this should not be returning the object, it should be sending the object to the shredder via AWS Lambda- therefore should I be referencing the below?

    //https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lambda.html
}

export default dataAPI; 
//TODO: edits to API files to make them import & run dataAPI