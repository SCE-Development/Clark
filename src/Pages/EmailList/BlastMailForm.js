import React from 'react';
import { Form, FormGroup, FormText, Label, Input } from 'reactstrap';
import './blast-mail.css';
import TextEditor from './TextEditor';

export default function BlastMailForm(props) {
  return (
    <Form>
      <FormGroup>
        <Label>Recipients</Label>
        <Input
          type="select"
          value={props.recipients}
          onChange={(e) => props.updateRecipients(e.target.value)}
        >
          <option value="">Choose...</option>
          <option value="Members">Members</option>
          <option value="Officers">Officers</option>
          <option value="Everyone">Everyone</option>
        </Input>
      </FormGroup>
      <FormGroup>
        <Label>Subject</Label>
        <Input
          placeholder=""
          value={props.subject}
          onChange={(e) => props.updateSubject(e.target.value)}
        />
      </FormGroup>
      <FormGroup>
        <Label>
          Text Area
          <FormText color="muted">
            For a larger workspace: Click on 'More...' then 'Fullscreen'. | |
            To return to the modal: Click on 'Fullscreen' again.
          </FormText>
          <FormText color="muted">
            Regular Spacing: Use Shift+Enter. | | Wider Spacing: Use Enter.
          </FormText>
        </Label>
        <TextEditor
          content={props.content}
          loadedContent={props.loadedContent}
          handleEditorChange={props.handleEditorChange}
        />
      </FormGroup>
    </Form>
  );
}
