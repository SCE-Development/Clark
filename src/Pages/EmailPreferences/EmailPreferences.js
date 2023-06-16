import React, { useEffect, useState } from "react";
import { Container, Input, Button, Col } from "reactstrap";

import Header from "../../Components/Header/Header";
import { setUserEmailPreference, getUserData } from "../../APIFunctions/User";

export default function EmailPreferencesPage(props) {
  const [isOptedIntoEmails, setIsOptedIntoEmails] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [userFirstName, setUserFirstName] = useState("");
  const [userLastName, setUserLastName] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const userEmailParam = urlParams.get("user");
      setUserEmail(userEmailParam);

      const response = await getUserData(urlParams.get("user"));
      setUserFirstName(response.responseData.firstName);
      setUserLastName(response.responseData.lastName);
      setIsOptedIntoEmails(response.responseData.emailOptIn);
    };

    fetchData();
  }, []);

  const handleSave = async () => {
    const response = await setUserEmailPreference(userEmail, isOptedIntoEmails);
    if (!response.error) setMessage("Yay! You changed your email preference!");
  };

  return (
    <div>
      <Header title="Email Preferences" />
      <Container
        style={{
          textAlign: "center",
        }}
      >
        <h1>
          Hello {userFirstName} {userLastName}
        </h1>
        <p>
          Opt into SCE club updates by email?:
          <Input
            type="checkbox"
            checked={isOptedIntoEmails}
            onChange={(e) => setIsOptedIntoEmails(e.target.checked)}
          />
        </p>
        <Button onClick={handleSave}>Save</Button>
        {message && <p>{message}</p>}
      </Container>
    </div>
  );
}
