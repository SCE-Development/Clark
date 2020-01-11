import React, { useState } from 'react'
import './register-page.css'
import {
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Input
} from 'reactstrap'

export default function MajorDropdown (props) {
  const [inputEnable, setInputEnable] = useState(props.inputEnable)
  const [major, setMajor] = useState()
  const [dropdownOpen, setDropdownOpen] = useState()

  function handleMajorChange (e) {
    props.setMajor(e.target.value)
    setMajor(e.target.value)
    setInputEnable(e.target.value === 'Other')
  }

  const options = ['Computer Engineering', 'Software Engineering', 'Other']

  return (
    <>
      <p>Major</p>
      <ButtonDropdown
        id='h'
        isOpen={dropdownOpen}
        toggle={() => setDropdownOpen(!dropdownOpen)}
      >
        <DropdownToggle caret>
          {!inputEnable ? major || 'Select major' : 'Other'}
        </DropdownToggle>
        <DropdownMenu>
          {options.map((option, index) => {
            return (
              <DropdownItem
                onClick={handleMajorChange}
                key={index}
                value={option}
              >
                {option}
              </DropdownItem>
            )
          })}
        </DropdownMenu>
      </ButtonDropdown>
      {inputEnable ? (
        <Input
          placeholder='Enter major here...'
          onChange={e => props.setMajor(e.target.value)}
        />
      ) : null}
    </>
  )
}
