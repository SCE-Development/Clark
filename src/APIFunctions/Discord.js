import axios from 'axios'
import { ApiResponse } from './ApiResponses'
import { EventAuthorizationToken } from '../config/config.json'

/**
 * Sends an API request to the discord server to retrieve the ___ most recent messages on a specified discord channel
 * @param {String} channel_id -- the channel id of the channel (can be found by using the network feature in any given browser's devtools)
 * @param {String} authorization_num -- the discord authorization number that will give you access to said account (can get rid of it with config file)
 * @param {String} num_of_messages -- the number of most recent messages you wish to collect 
 * @returns all the json data for the nth most recent discord messages on a given channel
 */
export async function getDiscordMessages(channel_id, num_of_messages) {
    let response = new ApiResponse()
    let header = {'authorization' : EventAuthorizationToken};
    await axios
    .get('https://discord.com/api/v9/channels/' + channel_id + '/messages?limit=' + num_of_messages, {
      headers: header
    })
    .then(discord_messages => {
      //console.log(discord_messages)
      response.responseData = discord_messages.data
      //console.log(response.responseData)
    }) 
    .catch(err => {
        console.log(error)
    })
    return response;
}