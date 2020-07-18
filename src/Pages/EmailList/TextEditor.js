import React from 'react';
import { Editor } from '@tinymce/tinymce-react';
export default function TextEditor(props) {
  return (
    <div>
      <Editor
        apiKey="3q3vjb0bbtg3jx437evqdsttkyz77mwas325effmyrxwrk33"
        initialValue={props.loadedContent}
        init={{
          height: 500,
          menubar: false,
          plugins: [
            'print preview paste importcss searchreplace autolink',
            'save directionality code visualblocks visualchars',
            'fullscreen image link media template codesample table charmap hr',
            'pagebreak nonbreaking anchor toc insertdatetime advlist lists',
            'wordcount imagetools textpattern noneditable help charmap',
            'quickbars emoticons',
          ],
          toolbar:
            'undo redo | fontselect fontsizeselect formatselect |' +
            'bold italic underline | forecolor backcolor |' +
            'alignleft aligncenter alignright |  bullist numlist outdent' +
            'indent removeformat | table charmap emoticons| fullscreen' +
            'preview print | insertfile image media pageembed link codesample' +
            '| help',

          toolbar_mode: 'sliding',
          contextmenu: 'bold italic underline forecolor backcolor link',
          quickbars_insert_toolbar: false,
          quickbars_selection_toolbar: false,
          resize: false,
        }}
        value={props.loadedContent}
        onEditorChange={props.handleEditorChange}
      />
    </div>
  );
}
