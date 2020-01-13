import React, { useState } from 'react'
import './register-page.css'
import MembershipPlan from './MembershipPlan.js'
import { memberApplicationState } from '../../Enums'
import MembershipForm from './MembershipForm'
import ConfirmationPage from './ConfirmationPage'

export default function MembershipApplication () {
  const [membershipState, setMembershipState] =
    useState(memberApplicationState.SELECT_MEMBERSHIP_PLAN)
  const [selectedPlan, setSelectedPlan] = useState()

  function renderCorrectComponent () {
    const appProps = {
      setMembershipState,
      selectedPlan,
      setSelectedPlan
    }
    switch (membershipState) {
      case memberApplicationState.SELECT_MEMBERSHIP_PLAN:
        return <MembershipPlan {...appProps} />
      case memberApplicationState.FORM_INFO:
        return <MembershipForm {...appProps} />
      case memberApplicationState.CONFIRMATION:
        return <ConfirmationPage />
      default:
        break
    }
  }

  return (
    <div className='membership-application'>
      {renderCorrectComponent()}
    </div>
  )
}
