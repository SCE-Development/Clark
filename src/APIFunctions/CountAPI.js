/** 
 * Used to process data from APIs to count and send to skylab pipeline 
 */

//TODO: What imports are needed?

/** 
 * Creates a JSON object when an API endpoint is called 
 * @param {string} name the name of the API that was called
 * @param {bool} err whether the API caused an error or not 
 * @param {string} ID the ID of the user that called the function
 * @param {string} descr description of what the API does?
 * @returns {object} a json object containing all the relevant raw data 
*/
export async function dataAPI(name, err, ID, descr){
    //find a way to catch the current date and time when this function is called 
    let formatDay = new Date(); 
    let APIdate = formatDay.getFullYear()+'-'+(formatDay.getMonth()+1)+'-'+formatDay.getDate();

    let APItime = formatDay.getHours() + ":" + formatDay.getMinutes() + ":" + formatDay.getSeconds();

    /*
    const {
        api_name: name, 
        Error: err, 
        date: APIdate, 
        time: APItime, 
        userID: ID, 
        description: descr
    } = apiCountObj; 
    */

    const {} = apiCountObj; 

    return apiCountObj;
    //TODO: this should not be returning the object, it should be sending the object to the shredder via AWS Lambda- therefore should I be referencing the below?

    //https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lambda.html
}

export default dataAPI; 
//TODO: edits to API files to make them import & run dataAPI