import React, { useEffect, useState } from 'react';
import { countMembers } from '../../APIFunctions/User';


export default function ClubRevenue(props) {
  
  useEffect(() => {
    async function fetchMembers() {
      const status = await countMembers(props.user.token);
      console.log(status.responseData.count);
    }

    fetchMembers();
  }, [props.user.token]);

  return (
    <div className="m-10">
      
    </div>
  );
}