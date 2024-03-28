import React, { useEffect, useState } from 'react';

import { getAllDesserts } from '../../APIFunctions/Desserts';
import { Container } from 'reactstrap';

export default function DessertPage() {
  const [desserts, setDesserts] = useState([]);
  async function getDessertsFromDB() {
    const dessertsFromDB = await getAllDesserts();
    if (!dessertsFromDB.error) {
      setDesserts(dessertsFromDB.responseData);
    }
  }

  useEffect(() => {
    getDessertsFromDB();
  }, []);

  return (
    <div> not admin
      <Container>
        {desserts.map((dessert, index) => (
          <div key={index}>
            <h1>{dessert.name}</h1>
            <p>description: {dessert.description}</p>
          </div>
        ))}
      </Container>
    </div>
  );
}