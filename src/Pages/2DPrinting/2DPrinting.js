import React, { useState } from 'react';
import './2D-printing.css';
import ConfirmationModal from
  '../../Components/DecisionModal/ConfirmationModal.js';
import Header from
  '../../Components/Header/Header.js';
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormGroup,
  Label,
  Input,
  Col,
  Row
} from 'reactstrap';
import { FilePond, registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import FilePondPluginFileEncode from 'filepond-plugin-file-encode';
import { PDFDocument } from 'pdf-lib';
import {
  range,
  parseRange,
  printPage,
  getPagesPrinted
} from '../../APIFunctions/2DPrinting';
import { editUser } from '../../APIFunctions/User';

registerPlugin(FilePondPluginFileValidateType, FilePondPluginFileEncode);

export default function Printing(props) {
  const [files, setFiles] = useState([]);
  const [continueButn, setContinue] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const [pages, setPages] = useState(false);
  const [previewModal, setPreviewModal] = useState(false);
  const [dataURI, setDataURI] = useState('');
  const [encodedFile, setEncodedFile] = useState();
  const [copies, setCopies] = useState(1);
  const [sides, setSides] = useState('one-sided');
  const [pageRanges, setPageRanges] = useState('NA');
  const [numPages, setNumPages] = useState(0);
  const [usedPages, setUsedPages] = useState([]);
  const [canPrint, setCanPrint] = useState(false);
  const [displayPagesLeft, setDisplayPagesLeft] = useState(
    props.user.pagesPrinted
  );
  const [previewDisplay, setPreviewDisplay] = useState('');
  const previewLabels = {
    copies: 'Number of Copies',
    sides: 'Type of print',
    pages: 'Pages'
  };
  const headerProps = {
    title: 'SCE Printing System'
  };

  const confirmModalProps = {
    headerText: 'Are you sure you want to print?',
    bodyText: 'Click Yes or Go Back',
    confirmText: 'Yes!',
    cancelText: 'Go Back',
    confirmColor: 'success',
    toggle: () => {
      setConfirmModal(!confirmModal);
    },
    handleConfirmation: () => {
      handlePrinting(encodedFile);
    },
    open: confirmModal
  };

  async function updateEmbed(totalPages) {
    const pdf = await PDFDocument.load(dataURI);
    const display = await PDFDocument.create();
    const copiedPages = await display.copyPages(
      pdf,
      Array.from(totalPages).map(x => x - 1)
    );
    copiedPages.forEach(element => {
      display.addPage(element);
    });
    const data = await display.saveAsBase64({ dataUri: true });
    setPreviewDisplay(data);
  }

  async function handleCanPrint(totalPages, copy) {
    const result = await getPagesPrinted(
      props.user.email,
      props.user.token,
      totalPages,
      copy
    );
    setCanPrint(result.canPrint);
    setDisplayPagesLeft(result.remainingPages);
    updateEmbed(totalPages);
  }

  async function handleUpdate(file) {
    setDataURI(file.getFileEncodeDataURL());
    setPreviewDisplay(file.getFileEncodeDataURL());
    setEncodedFile(file);
    setContinue(true);
    const pdf = await PDFDocument.load(file.getFileEncodeDataURL());
    setNumPages(pdf.getPages().length);
    let tmp = new Set(range(1, pdf.getPages().length + 1));
    setUsedPages(tmp);
  }

  function handlePrinting(file) {
    const raw = file.getFileEncodeBase64String();
    const destination = 'HP-LaserJet-p2015dn';
    let data = {
      raw,
      pageRanges: pageRanges.replace(/\s/g, ''),
      sides,
      copies,
      destination
    };
    const pagesPrinted = usedPages.size * copies + (30 - displayPagesLeft);

    editUser({ ...props.user, pagesPrinted }, props.user.token);
    printPage(data);

    setConfirmModal(!confirmModal);
    setPreviewModal(false);
    setFiles([]);
    setContinue(false);
    setPages(false);
  }

  return (
    <div>
      <Header {...headerProps} />

      <div className='printInfo'>
        <p>
          Welcome to printing! Click the icon below and upload your file. Each
          member can print up to 30 pages a week.
        </p>
      </div>

      <FilePond
        files={files}
        allowMultiple={false}
        acceptedFileTypes={['application/pdf']}
        maxFileSize='10MB'
        onupdatefiles={fileItems => {
          const tmp = fileItems.map(fileItem => fileItem.file);
          setFiles(tmp);
        }}
        onaddfile={async (err, file) => {
          if (!err) await handleUpdate(file);
        }}
        onremovefile={err => {
          setContinue(false);
          setPages(false);
          if (!err) setFiles([]);
        }}
        labelIdle="Drag & Drop or Touch Here <br />
          <svg aria-hidden='true' viewBox='0 0 512 512' width='40%'>
            <path
              d='M399.95 160h-287.9C76.824 160 48 188.803 48
            224v138.667h79.899V448H384.1v-85.333H464V224c0-
            35.197-28.825-64-64.05-64zM352
            416H160V288h192v128zm32.101-352H127.899v80H384.1V64z'
            />
          </svg>"
      />

      <Button
        color='primary'
        className='continue'
        hidden={!continueButn}
        onClick={() => {
          handleCanPrint(usedPages, copies);
          setPreviewModal(true);
        }}
      >
        continue
      </Button>
      <Modal
        isOpen={previewModal}
        toggle={() => {
          setPreviewModal(!previewModal);
        }}
        size='xl'
      >
        <ModalHeader
          toggle={() => {
            setPreviewModal(!previewModal);
          }}
        >
          Confirm
        </ModalHeader>
        <ModalBody>
          <Row>
            <Col sm={{ size: 8 }}>
              <iframe
                src={files[0] && previewDisplay}
                title='Preview'
                width='100%'
                height='100%'
              />
            </Col>
            <Col>
              <div
                style={{
                  marginRight: '10%'
                }}
              >
                <br />
                <FormGroup>
                  <font size='4' color='red'>
                    <b>You have {displayPagesLeft} pages left</b>
                  </font>
                  <legend className='center-blocks' htmlFor='numcopy'>
                    {previewLabels.copies}
                  </legend>
                  <Input
                    className='center-blocks'
                    type='number'
                    name='numbers'
                    min='1'
                    max='30'
                    id='numcopy'
                    defaultValue='1'
                    onChange={e => {
                      setCopies(e.target.value);
                      handleCanPrint(usedPages, e.target.value);
                    }}
                  />
                  <legend className='center-blocks'>
                    {previewLabels.sides}{' '}
                  </legend>
                  <FormGroup check>
                    <Label check>
                      <Input
                        type='radio'
                        name='pType'
                        onChange={e => {
                          setSides('one-sided');
                        }}
                        defaultChecked
                      />{' '}
                        Front
                    </Label>
                  </FormGroup>
                  <FormGroup check>
                    <Label check>
                      <Input
                        type='radio'
                        name='pType'
                        onChange={e => {
                          setSides('two-sided-long-edge');
                        }}
                      />{' '}
                        Front & Back
                    </Label>
                  </FormGroup>
                  <legend className='center-blocks'>
                    {previewLabels.pages}{' '}
                  </legend>
                  <FormGroup check>
                    <Label check>
                      <Input
                        type='radio'
                        name='Pages'
                        onChange={() => {
                          setPages(false);
                          setPageRanges('NA');
                          handleCanPrint(
                            new Set(range(1, numPages + 1)),
                            copies
                          );
                        }}
                        defaultChecked
                      />
                        All
                    </Label>
                  </FormGroup>
                  <FormGroup check>
                    <Label check>
                      <Input
                        type='radio'
                        name='Pages'
                        checked={pages}
                        onChange={() => {
                          setPages(true);
                          handleCanPrint(usedPages, copies);
                        }}
                      />
                      <Input
                        type='text'
                        disabled={!pages}
                        placeholder='1-5, 7, 9-11'
                        onChange={async e => {
                          setPageRanges(e.target.value);
                          const x = await parseRange(
                            e.target.value, numPages
                          );
                          setUsedPages(x);
                          handleCanPrint(x, copies);
                        }}
                      />
                    </Label>
                  </FormGroup>
                </FormGroup>
                <Label className='center-blocks'>
                  Note: All prints are black ink only
                </Label>
                <br />
              </div>
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          <Button
            color='danger'
            style={{
              float: 'left'
            }}
            onClick={() => {
              setPreviewModal(false);
              setPages(false);
              let arr = new Set(range(1, numPages + 1));
              setUsedPages(arr);
            }}
          >
            Back
          </Button>
          <Button
            color='success'
            style={{
              float: 'right'
            }}
            onClick={() => {
              setConfirmModal(!confirmModal);
            }}
            disabled={!canPrint}
          >
            Print!
          </Button>
        </ModalFooter>

        <ConfirmationModal {...confirmModalProps} />
      </Modal>
    </div>
  );
}
