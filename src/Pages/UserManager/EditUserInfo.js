import React, { useState, useEffect } from 'react';
import {
  getUserById,
  editUser,
} from '../../APIFunctions/User';

import MajorDropdown from '../MembershipApplication/MajorDropdown';
import RoleDropdown from './RoleDropdown';
import ExpirationDropdown from './ExpirationDropdown';
import { membershipState, membershipStateToString } from '../../Enums';
import { sendVerificationEmail } from '../../APIFunctions/Mailer';


export default function EditUserInfo(props) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [doorCode, setDoorCode] = useState('');
  const [major, setMajor] = useState();
  const [pagesPrinted, setPagesPrinted] = useState();
  const [emailVerified, setEmailVerified] = useState();
  const [accessLevel, setAccessLevel] = useState('');
  const [email, setEmail] = useState('');
  const [emailOptIn, setEmailOptIn] = useState();
  const [
    numberOfSemestersToSignUpFor,
    setNumberOfSemestersToSignUpFor
  ] = useState();
  const [discordId, setDiscordId] = useState();
  const [membershipExpiration, setMembershipExpiration] = useState(new Date());
  const [joinDate, setJoinDate] = useState();
  const [submitButtonText, setSubmitButtonText] = useState('Submit');
  const [submitButtonColor, setSubmitButtonColor] = useState('primary');
  const [
    verificationEmailButtonText,
    setVerificationEmailButtonText
  ] = useState('Send');
  const [dataWasChanged, setDataWasChanged] = useState(false);

  const INPUT_CLASS_NAME = 'indent-2 block w-full rounded-md border-0 py-1.5   shadow-sm ring-1 ring-inset ring-gray-300 placeholder:  focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6';

  const [loading, setLoading] = useState(true);
  const [userNotFound, setUserNotFound] = useState(false);

  const [OriginalFirstName, setOriginalFirstName] = useState('');
  const [OriginalLastName, setOriginalLastName] = useState('');
  const [OriginalPassword, setOriginalPassword] = useState('');
  const [OriginalDoorCode, setOriginalDoorCode] = useState('');
  const [OriginalMajor, setOriginalMajor] = useState();
  const [OriginalPagesPrinted, setOriginalPagesPrinted] = useState();
  const [OriginalEmailVerified, setOriginalEmailVerified] = useState();
  const [OriginalAccessLevel, setOriginalAccessLevel] = useState();
  const [OriginalEmail, setOriginalEmail] = useState('');
  const [OriginalEmailOptIn, setOriginalEmailOptIn] = useState();
  const [
    OriginalNumberOfSemestersToSignUpFor,
    setOriginalNumberOfSemestersToSignUpFor
  ] = useState();
  const [OriginalDiscordId, setOriginalDiscordId] = useState();
  const [OriginalMembershipExpiration, setOriginalMembershipExpiration] = useState(new Date());


  useEffect(() => {
    async function getUser() {
      const result = await getUserById(props.match.params.id, props.user.token);
      if (result.error) {
        setUserNotFound(true);
      } else {
        setFirstName(result.responseData.firstName);
        setOriginalFirstName(result.responseData.firstName);
        setLastName(result.responseData.lastName);
        setOriginalLastName(result.responseData.lastName);
        setDoorCode(result.responseData.doorCode);
        setOriginalDoorCode(result.responseData.doorCode);
        setMajor(result.responseData.major);
        setOriginalMajor(result.responseData.major);
        setPagesPrinted(result.responseData.pagesPrinted);
        setOriginalPagesPrinted(result.responseData.pagesPrinted);
        setEmailVerified(result.responseData.emailVerified);
        setOriginalEmailVerified(result.responseData.emailVerified);
        setAccessLevel(result.responseData.accessLevel);
        setOriginalAccessLevel(result.responseData.accessLevel);
        setEmailOptIn(result.responseData.emailOptIn);
        setOriginalEmailOptIn(result.responseData.emailOptIn);
        setJoinDate(new Date(result.responseData.joinDate));
        setMembershipExpiration(
          new Date(result.responseData.membershipValidUntil)
        );
        setOriginalMembershipExpiration(new Date(result.responseData.membershipValidUntil));
        setDiscordId(result.responseData.discordId);
        setOriginalDiscordId(result.responseData.discordId);
        setEmail(result.responseData.email);
        setOriginalEmail(result.responseData.email);
      }
      setLoading(false);
    }
    getUser();
  }, []);

  useEffect(() => {
    const handleBeforeUnload = (ev) => {
      if (dataWasChanged) {
        ev.preventDefault();
        ev.returnValue = '';
        return ''; // required for safari
      }
    };
    console.log(dataWasChanged);
    console.log(OriginalMajor);
    console.log(major);
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [dataWasChanged, []]);

  async function handleSubmit() {
    if (!dataWasChanged) {
      return;
    }
    const result = await editUser({
      _id: props.match.params.id,
      firstName,
      lastName,
      email,
      password,
      major,
      numberOfSemestersToSignUpFor,
      doorCode,
      discordID: discordId,
      pagesPrinted,
      accessLevel,
      emailVerified,
      emailOptIn,
    }, props.user.token);
    if (result.error) {
      alert(
        'saving user failed. please contact dev team if retrying fails.'
      );
    } else {
      setSubmitButtonText('Saved!');
      setSubmitButtonColor('success');
      setTimeout(() => {
        setDataWasChanged(false);
        setSubmitButtonText('Submit');
      }, 1500);
    }
  }

  function renderExpirationDate() {
    // default case, render the users expiration
    let expiresOrExpired = 'expires';
    let maybeFontColor = '';
    let message = null;

    const membershipIsExpired = new Date() > membershipExpiration;
    const userIsOfficerOrAdmin = accessLevel >= membershipState.OFFICER;
    const userIsPendingOrBanned = accessLevel <= membershipState.PENDING;

    if (userIsOfficerOrAdmin) {
      maybeFontColor = 'green';
      message = (<div className="userRolePrompt">
        Membership does not expire as the user is an{' '}
        <b>{membershipStateToString(accessLevel)}</b>
      </div>);
    } else if (userIsPendingOrBanned) {
      maybeFontColor = 'red';
      message = (<div className="userRolePrompt">
        Membership invalid, user has the{' '}
        <b>{membershipStateToString(accessLevel)}</b> role.
      </div>);
    } else {
      // Default case, if a user isn't in one of the above special roles
      // just render the status (valid or expired) of their membership
      if (membershipIsExpired) {
        expiresOrExpired = 'expired';
        maybeFontColor = 'red';
      }
      message = <div className="userRolePrompt">
        Membership {expiresOrExpired} on{' '}
        <b>{membershipExpiration.toDateString()}</b>
      </div>;
    }

    return (
      <span style={{ color: maybeFontColor }}>
        {message}
      </span>
    );
  }

  function renderUserInfo() {
    if (loading) {
      return <h1 style={{ textAlign: 'center' }}>loading...</h1>;
    }

    if (userNotFound) {
      return (
        <div className="flex flex-row min-h-screen justify-center items-center">
          <div role="alert" className="alert alert-warning">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            <span>
              User with ID: {props.match.params.id} not found.
            </span>
          </div>
        </div>
      );
    } else {
      return (
        <div>
          <div className="space-y-12">
            <div className="border-b border-gray-900/10 mt-10 pb-12">
              <h2 className="text-base font-semibold leading-7">Edit Member Information</h2>
              <div className='flex flex-col md:flex-row mt-5'>
                <div className='md:w-3/6'>
                  Joined SCE: <b>{joinDate.toDateString()}</b>
                </div>
                <div className='flex w-auto md:w-5/6 md:justify-end'>
                  <div >
                    {renderExpirationDate()}
                  </div>
                </div>
              </div>
              <div className="mt-10 sm:col-span-4">
                <label htmlFor="email" className="block text-sm font-medium leading-6">Email address</label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    defaultValue={email}
                    onChange={(e) => {
                      const newEmail = e.target.value;
                      if(OriginalEmail == newEmail){
                        setDataWasChanged(false);
                      } else {
                        setDataWasChanged(true);
                        setEmail(e.target.value);
                      }
                    }}
                    className={INPUT_CLASS_NAME}
                  />
                </div>
              </div>
              <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-2 sm:col-start-1">
                  <label htmlFor="password" className="block text-sm font-medium leading-6">Password</label>
                  <div className="mt-2">
                    <input
                      type="password"
                      name="password"
                      id="password"
                      className={INPUT_CLASS_NAME}
                      placeholder='intentionally blank'
                      onChange={(e) => {
                        const newPassword = e.target.value;
                        if(OriginalPassword == newPassword){
                          setDataWasChanged(false);
                        } else {
                          setDataWasChanged(true);
                          setPassword(e.target.value);
                        }
                      }}
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="pages-printed" className="block text-sm font-medium leading-6">Pages Printed</label>
                  <div className="mt-2">
                    <input
                      type="number"
                      name="pages-printed"
                      id="pages-printed"
                      defaultValue={pagesPrinted}
                      autoComplete="address-level1"
                      className={INPUT_CLASS_NAME}
                      onChange={(e) => {
                        const newPagesPrinted = e.target.value;
                        if(OriginalPagesPrinted == newPagesPrinted){
                          setDataWasChanged(false);
                        } else {
                          setDataWasChanged(true);
                          setPagesPrinted(e.target.value);
                        }
                      }}
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="door-code" className="block text-sm font-medium leading-6">Door Code</label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="door-code"
                      id="door-code"
                      className={INPUT_CLASS_NAME}
                      defaultValue={doorCode}
                      onChange={(e) => {
                        const newDoorCode = e.target.value;
                        if(OriginalDoorCode == newDoorCode){
                          setDataWasChanged(false);
                        } else {
                          setDataWasChanged(true);
                          setDoorCode(e.target.value);
                        }
                      }}
                    />
                  </div>
                </div>
                <div className="sm:col-span-3">
                  <ExpirationDropdown
                    defaultValue={'asdfasf'}
                    setNumberOfSemestersToSignUpFor={(value) => {
                      const newNumberOfSemestersToSignUpFor = value;
                      if(OriginalNumberOfSemestersToSignUpFor == newNumberOfSemestersToSignUpFor){
                        setDataWasChanged(false);
                      } else {
                        setDataWasChanged(true);
                        setNumberOfSemestersToSignUpFor(value);
                      }
                    }}
                  />
                </div>
                <div className="sm:col-span-4 w-4/6">
                  <div className="form-control">
                    <label className="label cursor-pointer">
                      <span className="label-text">Email Verified?</span>
                      <input
                        type="checkbox"
                        className="toggle"
                        checked={!!emailVerified}
                        onChange={(e) => {
                          const newEmailVerified = e.target.checked;
                          if(OriginalEmailVerified == newEmailVerified){
                            setDataWasChanged(false);
                          } else {
                            setDataWasChanged(true);
                            setEmailVerified(e.target.checked);
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>
                <div className="sm:col-span-4 w-4/6">
                  <div className="form-control">
                    <label className="label cursor-pointer">
                      <span className="label-text">Resend verification email (sends to most recently saved email):</span>
                      <div
                        className="btn btn-success w-auto"
                        checked={emailOptIn}
                        onClick={async () => {
                          const result = await sendVerificationEmail(email, props.user.token);
                          if (result.error) {
                            return alert(
                              'unable to send verification email.' +
                              ' please contact dev team if retrying fails'
                            );
                          }
                          setVerificationEmailButtonText('Email sent!');
                          setTimeout(() => {
                            setVerificationEmailButtonText('Send');
                          }, 1500);
                        }}
                      >
                        {verificationEmailButtonText}
                      </div>
                    </label>
                  </div>
                </div>
                <div className="sm:col-span-3">
                  <RoleDropdown
                    setuserMembership={(value) => {
                      const newAccessLevel = value;
                      if(OriginalAccessLevel == newAccessLevel){
                        setDataWasChanged(false);
                      } else {
                        setDataWasChanged(true);
                        setAccessLevel(value);
                      }
                    }}
                    defaultValue={accessLevel}
                  />
                </div>
                <div className="sm:col-span-3">
                  <MajorDropdown
                    defaultMajor={major}
                    setMajor={(value) => {
                      const newMajor = value;
                      if(OriginalMajor == newMajor){
                        setDataWasChanged(false);
                      } else {
                        setDataWasChanged(true);
                        setMajor(value);
                      }
                    }} />
                </div>
              </div>

              <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="col-span-4 sm:col-span-3">
                  <label htmlFor="first-name" className="block text-sm font-medium leading-6">First name</label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="first-name"
                      id="first-name"
                      autoComplete="given-name"
                      className={INPUT_CLASS_NAME}
                      defaultValue={firstName}
                      onChange={(e) => {
                        const newFirstName = e.target.value;
                        if(OriginalFirstName == newFirstName){
                          setDataWasChanged(false);
                        } else {
                          setDataWasChanged(true);
                          setFirstName(e.target.value);
                        }
                      }}
                    />
                  </div>
                </div>

                <div className="col-span-4 sm:col-span-3">
                  <label htmlFor="last-name" className="block text-sm font-medium leading-6">Last name</label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="last-name"
                      id="last-name"
                      autoComplete="family-name"
                      className={INPUT_CLASS_NAME}
                      defaultValue={lastName}
                      onChange={(e) => {
                        const newLastName = e.target.value;
                        if(OriginalLastName == newLastName){
                          setDataWasChanged(false);
                        } else {
                          setDataWasChanged(true);
                          setLastName(e.target.value);
                        }
                      }}
                    />
                  </div>
                </div>


                <div className="col-span-4 w-4/6">
                  <div className="form-control">
                    <label className="label cursor-pointer">
                      <span className="label-text">Opt into blast emails?</span>
                      <input type="checkbox" className="toggle" checked={emailOptIn}
                        onChange={(e) => {
                          const newEmailOptIn = e.target.checked;
                          if(OriginalEmailOptIn === newEmailOptIn){
                            //setDataWasChanged(false);
                          } else {
                            setDataWasChanged(true);
                            setEmailOptIn(e.target.checked);
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>

                <div className="col-span-4">
                  <label htmlFor="discord-id" className="block text-sm font-medium leading-6">Discord ID</label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="discord-id"
                      id="discord-id"
                      className={INPUT_CLASS_NAME}
                      defaultValue={discordId}
                      onChange={(e) => {
                        const newDiscordId = e.target.value;
                        if(OriginalDiscordId == newDiscordId){
                          setDataWasChanged(false);
                        } else {
                          setDataWasChanged(true);
                          setDiscordId(e.target.value);
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

          </div>

          {dataWasChanged && (
            <div className="pb-6 flex items-center justify-end gap-x-6">
              <button
                type="button"
                className="text-sm font-semibold leading-6"
                // we can do better here, we can keep track of the user's
                // initial state and just revert to it instead of reloading
                // the page
                onClick={() => window.location.reload()}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                onClick={() => handleSubmit()}
              >
                {submitButtonText}
              </button>
            </div>
          )}
        </div>
      );
    }
  }

  return (
    <div className='px-6 bg-base-300 text-slate-20'>
      {renderUserInfo()}
    </div>
  );
}
