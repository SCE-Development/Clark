/** 
 * Used to process data from APIs to count and send to skylab pipeline 
 */

/**
 * When a Core-v4 API endpoint is called  
 * Raw Data Format (JSON Object):
 *      api_name: string
 *      Error: bool
 *      date: string
 *      time: sting
 *      UserID: string
 *      Description: string
 * 
 */

/** 
 * Creates a JSON object when an API endpoint is called 
 * @param {string} name the name of the API that was called
 * @param {bool} error whether the API caused an error or not 
 * @param {string} userID the ID of the user that called the function
 * @param {string} description description of what the API does?
 * @returns {object} a json object containing all the relevant raw data 
*/
export async function dataAPI(){
    //find a way to catch the current date and time when this function is called 
}