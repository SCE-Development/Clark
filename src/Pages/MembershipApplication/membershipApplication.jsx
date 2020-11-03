import React, { useState } from 'react';
import './register-page.css';
import MembershipPlan from './MembershipPlan.js';
import { memberApplicationState } from '../../Enums';
import MembershipForm from './MembershipForm';
import ConfirmationPage from './ConfirmationPage';
import { CSSTransition } from 'react-transition-group';

export default function MembershipApplication() {
  const [membershipState, setMembershipState] =
    useState(memberApplicationState.SELECT_MEMBERSHIP_PLAN);
  const [selectedPlan, setSelectedPlan] = useState();
  const appProps = {
    setMembershipState,
    selectedPlan,
    setSelectedPlan
  };
  const membershipArray = [
    {
      isShown:
        membershipState=== memberApplicationState.SELECT_MEMBERSHIP_PLAN,
      Component: <MembershipPlan {...appProps} />
    },
    {
      isShown: membershipState === memberApplicationState.FORM_INFO,
      Component: <MembershipForm {...appProps} />
    },
    {
      isShown: membershipState === memberApplicationState.CONFIRMATION,
      Component: <ConfirmationPage />
    }
  ];

  return (
    <div>
      {membershipArray.map((registerView, index) => {
        return (
          <div key={index}>
            <CSSTransition
              in={registerView.isShown}
              timeout={300}
              classNames="fade"
              unmountOnExit>
              <div>
                {registerView.isShown && registerView.Component}
              </div>
            </CSSTransition>
          </div>
        );
      })}
    </div>
  );
}
