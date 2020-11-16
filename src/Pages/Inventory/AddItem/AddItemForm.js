import React from 'react';
import { Form, FormFeedback, FormGroup, FormText, Label, Input } from 'reactstrap';

export default function AddItemForm(props) {
  return (
    <Form>
      <FormGroup>
        <Label>Item Name
          <FormText color="muted">
            Make sure your item doesn't already exist in the table.
          </FormText>        
        </Label>
        <Input
          placeholder=""
          value={props.name}
          onChange={(e) => props.updateItemName(e.target.value)}
        />
      </FormGroup>
      <FormGroup>
        <Label>Price
          <FormText color="muted">
            Numerical input (1, 2, 3...)
          </FormText>
        </Label>
        <Input 
          invalid={isNaN(props.price) || props.price<0}
          placeholder=""
          value={props.price}
          onChange={(e) => props.updateItemPrice(e.target.value)}
        />
        <FormFeedback invalid="true">Please enter a non-negative number!</FormFeedback>
      </FormGroup>
      <FormGroup>
        <Label>Stock
          <FormText color="muted">
            Numerical input (1, 2, 3...)
          </FormText>
        </Label>
        <Input
          invalid={isNaN(props.stock) || props.stock<0}
          placeholder=""
          value={props.stock}
          onChange={(e) => props.updateItemStock(e.target.value)}
        />
        <FormFeedback invalid="true">Please enter a non-negative number!</FormFeedback>
      </FormGroup>
      <FormGroup>
        <Label>Category
          <FormText color="muted">
            Type String
          </FormText>
        </Label>
        <Input
          placeholder=""
          value={props.category}
          onChange={(e) => props.updateItemCategory(e.target.value)}
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
      <FormGroup>
        <Label>Picture
          <FormText color="muted">
            URL. Leave it blank for default image.
          </FormText>
        </Label>
        <Input
          placeholder=""
          value={props.picture}
          onChange={(e) => props.updateItemPicture(e.target.value)}
        />
      </FormGroup>
    </Form>
  );
}
