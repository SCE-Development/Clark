import React, { useEffect, useState } from 'react';
import { countMembers } from '../../APIFunctions/User';


export default function ClubRevenue(props) {
  
  const [newSingleSemester, setNewSingleSemester] = useState();
  const [newAnnualMembers, setNewAnnualMembers] = useState();
  const [totalNewMembersThisYear, setNewTotalMembers] = useState();
  const [currentActiveMembers, setCurrentActiveMembers] = useState();

  useEffect(() => {
    async function fetchMembers() {
      const status = await countMembers(props.user.token);
      setNewSingleSemester(status.responseData.newSingleSemester);
      setNewAnnualMembers(status.responseData.newAnnualMembers);
      setNewTotalMembers(status.responseData.totalNewMembersThisYear);
      setCurrentActiveMembers(status.responseData.currentActiveMembers);
    }
    fetchMembers();
  }, []);

  return (
    <div className="m-10 p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold mb-4">Club Revenue</h1>
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Total Earnings from New Members This Semester:</h2>
        <p className="text-lg text-green-600 font-medium">${newSingleSemester * 20 + newAnnualMembers * 30}</p>
      </div>
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Total New Members This Year:</h2>
        <p className="text-lg">{totalNewMembersThisYear}</p>
      </div>
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Current Active Members:</h2>
        <p className="text-lg">{currentActiveMembers}</p>
      </div>
    </div>
  );
}