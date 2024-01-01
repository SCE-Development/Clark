import React, { Component } from 'react';
import {Button} from 'reactstrap';
import rolesIMG from './pics/roles.png';

class DiscordSJSU extends Component {
  render() {
    const DiscordBotInv = 'https://discord.com/api/oauth2/authorize?'
    + 'client_id=819715999451709440&permissions=8&' +
    'scope=applications.commands%20bot';
    return (
      <div className='background DiscordSJSU__app'>
        <h1>SCE DISCORD BOT</h1>
        <p>This is a SCE DISCORD BOT developed by
          SCE for SJSU private organizations. </p>
        <p>If you are looking to only authorize or verify SJSU members to your
          discord channel then you are at the right place.
          This bot can verify and keep track of SJSU students or personnels
          and their discord accounts.</p>

        <a href={`${DiscordBotInv}`}
          target="_blank"><Button color="primary">Invite Bot
        - starts with "/help"</Button></a>

        <h1>Setup:</h1>
        <p>1. Create a `Bot` role with `administration` or
           just `Manage Roles` is sufficient. Assign it to the bot.</p>
        <p>2. Create a `Verified` role on your server that will
          be assigned to verified users.</p>

        <p>Roles Hierarchy:</p>
        <img src={rolesIMG}/>
        <p>Recommend removing `view-channels`
          or stricter privileges for `@everyone`</p>

        <h1>Major commands</h1>
        <p>The bot uses `slash-commands` starts with "/help".</p>
        <p>1. "/verify" verifies the executing user
          and automatically applying `Verified`
          role after sign in with SJSU email.</p>
        <p>2. "/who discord-id:@userOrID" states the
          students/personnels registered sjsu names.</p>
      </div>
    );
  }
}

export default DiscordSJSU;
