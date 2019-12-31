import React, { useState } from 'react'
import { ModalFooter, Button, Modal } from 'reactstrap'

export default function Confirmation (props) {
  const [toggleSubmit, setToggleSubmit] = useState(false)

  return (
    <ModalFooter>
      <Button
        onClick={async () => {
          (await props.check()) && setToggleSubmit(!toggleSubmit)
        }}
        color='primary'
      >
        Submit
      </Button>
      <Button
        onClick={() => {
          props.toggle()
        }}
        color='secondary'
      >
        Cancel
      </Button>

      <Modal
        style={{
          marginTop: '200px'
        }}
        isOpen={toggleSubmit}
      >
        <Button
          onClick={async () => {
            await props.submit()
            setToggleSubmit(!toggleSubmit)
            props.toggle()
            props.getOfficers()
          }}
          color='primary'
        >
          Submit!
        </Button>
        <Button
          style={{
            marginTop: '10px'
          }}
          onClick={() => setToggleSubmit(!toggleSubmit)}
          color='danger'
        >
          Nah! It's a mistake.
        </Button>
      </Modal>
    </ModalFooter>
  )
}
