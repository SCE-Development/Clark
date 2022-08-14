import React, { useState, useEffect } from 'react';
import Cookies from 'universal-cookie';
import {
  CustomInput
} from 'reactstrap';
import { toggleDarkTheme } from '../../APIFunctions/dark-theme';
import { sunIcon, moonIcon } from '../../Pages/UserManager/SVG';

export default function DarkMode(props) {
  const [darkTheme, setDarkTheme] = useState(true);

  function createCookie() {
    if (document.body.className === 'light') {
      setDarkTheme(true);
    } else {
      setDarkTheme(false);
    }
    toggleDarkTheme();
  }

  function keepState() {
    const cookie = new Cookies();
    if (cookie.get('dark') === 'true') {
      setDarkTheme(true);
    } else {
      setDarkTheme(false);
    }
  }

  useEffect(() => {
    keepState();
  }, []);

  return (
    <div id='toggler-left'>
      <div id='sun-icon' >{sunIcon()}</div>
      <div id='dark-toggler'>
        <CustomInput
          onChange={createCookie} className='darkToggle'
          type='switch' id='exampleCustomSwitch' name='customSwitch'
          checked={darkTheme} />
      </div>
      <div id='moon-icon' >{moonIcon()}</div>
    </div>
  );
}
