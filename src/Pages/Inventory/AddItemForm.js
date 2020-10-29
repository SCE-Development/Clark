import React from 'react';
import { Form, FormGroup, FormText, Label, Input } from 'reactstrap';
// import './blast-mail.css';

export default function AddItemForm(props) {
  return (
    <Form>
      <FormGroup>
        <Label>Item Name</Label>
        <Input
          placeholder=""
          value={props.name}
          onChange={(e) => props.updateItemName(e.target.value)}
        />
      </FormGroup>
      <FormGroup>
        <Label>Quantity
          <FormText color="muted">
            Numerical input (1, 2, 3...)
          </FormText>
        </Label>
        <Input
          placeholder=""
          value={props.quantity}
          onChange={(e) => props.updateItemQuantity(e.target.value)}
        />
      </FormGroup>
      <FormGroup>
        <Label>
          Description
          <FormText>
            Just a quick explanation of what the item is.
          </FormText>
        </Label>
        <Input 
          type="textarea"
          value={props.description}
          onChange={(e) => props.updateItemDescription(e.target.value)}
        />
      </FormGroup>
    </Form>
  );
}
