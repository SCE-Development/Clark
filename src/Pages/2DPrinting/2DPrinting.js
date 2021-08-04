import React, { useState } from 'react';
import './2D-printing.css';
import ConfirmationModal from
  '../../Components/DecisionModal/ConfirmationModal.js';
import Header from
  '../../Components/Header/Header.js';
import { registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import FilePondPluginFileEncode from 'filepond-plugin-file-encode';
import { PDFDocument } from 'pdf-lib';
import {
  range,
  parseRange,
  printPage,
  getPagesPrinted,
  logPrintRequest
} from '../../APIFunctions/2DPrinting';
import { editUser } from '../../APIFunctions/User';
import {
  PrintIcon,
  StatusModal,
  failPrintStatus,
  FileUpload
} from './2DComponents';
import { PrintPageModal } from './2DPrintPageModal';
import PrintingHealthCheck from './2DPrintingHealthCheck';
import * as countTime from '../../userTimeTraffic.js';

registerPlugin(FilePondPluginFileValidateType, FilePondPluginFileEncode);

export default function Printing(props) {

  React.useEffect(() =>{
    window.addEventListener('onload', countTime.onLoad);
    document.addEventListener('visibilitychange', countTime.visibilityChange);
    return () => {
      window.removeEventListener('onload', countTime.onLoad);
      document.removeEventListener('visibiltyChange',
        countTime.visibilityChange);
    };
  });

  /**
   * State variables:
   * files - pdf file stored in filepond
   * continueButn - enable continue button
   * confirmModal - pop up confirm modal
   * pages - set radio to select page range or use all
   * previewModal - enable print page modal
   * dataURI - used for updating embed
   * encodedFile - encoded file to be printed
   * copies - copies of file to be printed
   * sides - sides of file
   * pageRanges - page ranges to be printed
   * numPages - number of pages included in page range
   * usedPages - array of all pages to be printed
   * canPrint - checks if user has enough pages to print
   * displayPagesLeft - pages left
   * previewDisplay - iframe content
   * loadPreview - loading indicator of iframe
   * statusModal - status modal toggle
   * printStatus - status in statusModal
   */
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
  const [loadPreview, setLoadPreview] = useState(true);
  const [statusModal, setStatusModal] = useState(false);
  const [printStatus, setPrintStatus] = useState('');

  async function updateEmbed(totalPages) {
    try {
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
    } catch {
      setStatusModal(true);
      setCanPrint(false);
      setPrintStatus('Cannot print encrypted PDF');
    }
  }

  async function handleUpdate(file) {
    try {
      setDataURI(file.getFileEncodeDataURL());
      setPreviewDisplay(file.getFileEncodeDataURL());
      setEncodedFile(file);
      setContinue(true);
      const pdf = await PDFDocument.load(file.getFileEncodeDataURL());
      setNumPages(pdf.getPages().length);
      let tmp = new Set(range(1, pdf.getPages().length + 1));
      setUsedPages(tmp);
    } catch {
      setStatusModal(true);
      setCanPrint(false);
      setPrintStatus('Cannot print encrypted PDF');
    }
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

  function finishPrinting() {
    setConfirmModal(false);
    setPreviewModal(false);
    setFiles([]);
    setContinue(false);
    setPages(false);
  }

  const previewLabels = {
    copies: 'Number of Copies',
    sides: 'Type of print',
    pages: 'Pages'
  };

  const headerProps = {
    title: 'Printing'
  };

  const fileUploadProps = {
    filePond: {
      files: files,
      allowMultiple: false,
      acceptedFileTypes: ['application/pdf'],
      maxFileSize: '10MB',
      onupdatefiles: (fileItems) => {
        const tmp = fileItems.map(fileItem => fileItem.file);
        setFiles(tmp);
      },
      onaddfile: async (err, file) => {
        if (!err) await handleUpdate(file);
      },
      onremovefile: err => {
        setContinue(false);
        setPages(false);
        if (!err) setFiles([]);
      },
      labelIdle: PrintIcon
    },
    continueButton: {
      color: 'primary',
      className: 'continue',
      hidden: !continueButn,
      onClick: () => {
        handleCanPrint(usedPages, copies); // ->
        setPreviewModal(true);
      },
      text: 'Continue'
    }
  };

  async function handlePrinting(file) {
    const raw = file.getFileEncodeBase64String();
    const pagesPrinted = usedPages.size * copies + (30 - displayPagesLeft);
    const memberName = props.user.firstName + ' ' + props.user.lastName;
    let data = {
      raw,
      pageRanges: pageRanges.replace(/\s/g, ''),
      sides,
      copies
    };

    let status = await printPage(data);
    if (!status.error) {
      editUser({ ...props.user, pagesPrinted }, props.user.token);
      setPrintStatus('Printing succeeded!');
      logPrintRequest({
        numPages: numPages * copies,
        destination: status.responseData,
        printedDate: new Date(),
        memberName
      });
    } else {
      setPrintStatus(failPrintStatus);
      logPrintRequest({
        numPages: numPages * copies,
        destination: 'Fail',
        printedDate: new Date(),
        memberName
      });
    }
    setStatusModal(true);
  }

  const printPageModalProps = {
    isOpen: previewModal,
    toggle: () => {
      setPreviewModal(!previewModal);
    },
    size: 'xl',
    ModalHeader: {
      toggle: () => {
        setPreviewModal(!previewModal);
      }
    },
    ModalBody: {

      Col: {
        sm: { size: 8 }
      },
      Spinner: {
        className: 'loading-spinner',
        animation: 'border',
        variant: 'primary'
      },
      iFrame: {
        hidden: loadPreview,
        onLoad: () =>
          setTimeout(() => {
            setLoadPreview(false);
          }, 300),
        src: files[0] && previewDisplay,
        width: '100%',
        height: '100%'
      },
      pagesLeft: {
        size: '4',
        color: 'red'
      },
      legend: {
        className: 'center-blocks'
      },
      copyInput: {
        className: 'center-blocks',
        type: 'number',
        name: 'numbers',
        min: '1',
        max: '30',
        id: 'numcopy',
        defaultValue: '1',
        onChange: (e) => {
          setCopies(e.target.value);
          handleCanPrint(usedPages, e.target.value);
        }
      },
      sideInput: {
        type: 'radio',
        name: 'pType'
      },
      pagesAll: {
        type: 'radio',
        name: 'Pages',
        onChange: () => {
          setPages(false);
          setPageRanges('NA');
          handleCanPrint(
            new Set(range(1, numPages + 1)),
            copies
          );
          setLoadPreview(true);
        },
        defaultChecked: true
      },
      pagesSelect: {
        type: 'radio',
        name: 'Pages',
        checked: pages,
        onChange: () => {
          setPages(true);
          handleCanPrint(usedPages, copies);
          setLoadPreview(true);
        }
      },
      pagesRange: {
        type: 'text',
        disabled: !pages,
        placeholder: '1-5, 7, 9-11',
        onChange: async e => {
          setPageRanges(e.target.value);
          const x = await parseRange(
            e.target.value, numPages
          );
          setUsedPages(x);
          handleCanPrint(x, copies);
          setLoadPreview(true);
        }
      }

    },
    ModalFooter: {
      backButton: {
        color: 'danger',
        onClick: () => {
          setPreviewModal(false);
          setPages(false);
          // Reset the pages selection to "All"
          let arr = new Set(range(1, numPages + 1));
          setUsedPages(arr);
        },
        text: 'Back'
      },
      printButton: {
        color: 'success',
        onClick: () => {
          setConfirmModal(!confirmModal);
        },
        disabled: !canPrint,
        text: 'Print!'
      }
    },
    // Additional imports to be unpacked
    loadPreview,
    displayPagesLeft,
    previewLabels,
    setSides,
  };

  const confirmModalProps = {
    headerText: 'Are you sure you want to print?',
    bodyText: '',
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

  const statusModalProps = {
    headerText: 'Printing Status',
    bodyText: printStatus,
    confirmText: 'Finish!',
    confirmColor: 'success',
    toggle: () => {
      setStatusModal(!statusModal);
      setConfirmModal(false);
    },
    handleConfirmation: () => {
      finishPrinting();
      setStatusModal(!statusModal);
    },
    open: statusModal
  };

  return (
    <div>
      <Header {...headerProps} />
      <PrintingHealthCheck />
      <FileUpload {...fileUploadProps} />
      <PrintPageModal {...printPageModalProps} />
      <ConfirmationModal {...confirmModalProps} />
      <StatusModal {...statusModalProps} />
    </div>
  );
}
