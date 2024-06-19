import React, { useState, useEffect, useRef } from 'react';
import PageSelectDropdown from './PageSelectDropdown';
import {
  parseRange,
  printPage,
  getPagesPrinted,
} from '../../APIFunctions/2DPrinting';
import { editUser } from '../../APIFunctions/User';

import { PDFDocument, EncryptedPDFError } from 'pdf-lib';
import { healthCheck } from '../../APIFunctions/2DPrinting';
import ConfirmationModal from
  '../../Components/DecisionModal/ConfirmationModal.js';

export default function Printing(props) {
  const [dragActive, setDragActive] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const [numberOfPagesInPdfPreview, setNumberOfPagesInPdfPreview] = useState(0);
  const [pagesPrinted, setPagesPrinted] = useState(0);
  const [pagesToBeUsedInPrintRequest, setPagesToBeUsedInPrintRequest] = useState(0);
  const [dataUrl, setDataUrl] = useState('');
  const [sides, setSides] = useState('one-sided');
  const [previewDisplay, setPreviewDisplay] = useState('');
  const [pageRanges, setPageRanges] = useState('');
  const [copies, setCopies] = useState(1);
  const inputRef = useRef(null);
  const [printStatus, setPrintStatus] = useState('');
  const [printStatusColor, setPrintStatusColor] = useState('success');
  const [files, setFiles] = useState(null);

  const [printerHealthy, setPrinterHealthy] = useState(false);
  const [loading, setLoading] = useState(true);

  async function checkPrinterHealth() {
    setLoading(true);
    const status = await healthCheck();
    setPrinterHealthy(status && !status.error);
    setLoading(false);
  }

  async function getNumberOfPagesPrintedSoFar() {
    const result = await getPagesPrinted(
      props.user.email,
      props.user.token,
    );
    setPrinterHealthy(!result.error);
    if (!result.error) {
      setPagesPrinted(result.pagesUsed);
    }
  }

  useEffect(() => {
    checkPrinterHealth();
    getNumberOfPagesPrintedSoFar();
  }, []);

  const INPUT_CLASS_NAME = 'indent-2 block rounded-md border-0 py-1.5   shadow-sm ring-1 ring-inset ring-gray-300 placeholder:  focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6';

  const sideOptions = [
    { label: 'Single Sided', value: 'one-sided' },
    { label: 'Double Sided', value: 'two-sided' },
  ];

  async function getUri() {
    try {
      const pdf = await PDFDocument.load(dataUrl);
      const display = await PDFDocument.create();
      const pagesWeWantToPrint = parseRange(pageRanges, pdf.getPages().length);
      const copiedPages = await display.copyPages(
        pdf,
        Array.from(pagesWeWantToPrint).map((x) => x - 1),
      );
      copiedPages.forEach((element) => {
        display.addPage(element);
      });
      // convert pdf to blob url (allows display of larger pdfs)
      const pdfBytes = await display.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const objectUrl = URL.createObjectURL(blob);
      setNumberOfPagesInPdfPreview(display.getPages().length);
      setPreviewDisplay(objectUrl);
    } catch (e) {
      // the error looks like Input document to `PDFDocument.load` is encrypted
      if (e.message.includes('is encrypted')) {
        setFiles(null);
        setDataUrl('');
        setPrintStatus('This PDF is encrypted and cannot be printed');
        setPrintStatusColor('error');
        setTimeout(() => {
          setPrintStatus(null);
        }, 5000);
      } else {
        setPrintStatus('Failed to load PDF');
        setPrintStatusColor('error');
      }
    }
  }

  useEffect(() => {
    if (dataUrl) {
      getUri();
    }
  }, [dataUrl, pageRanges]);

  useEffect(() => {
    if (previewDisplay) {
      let divisor = 1;
      if (sides === 'two-sided') {
        divisor = 2;
      }
      const pagesUsedPerCopy = Math.floor(numberOfPagesInPdfPreview / divisor) + (numberOfPagesInPdfPreview % divisor);
      const totalPagesUsed = pagesUsedPerCopy * Math.floor(copies);
      setPagesToBeUsedInPrintRequest(totalPagesUsed);
    }
  }, [previewDisplay, copies, sides]);

  useEffect(() => {
    if (confirmModal) {
      setConfirmModal(false);
    }
  }, [confirmModal]);

  async function handleChange(e) {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      let a = new FileReader();
      // https://stackoverflow.com/a/43894750
      a.onload = function(event) {
        setDataUrl(event.target.result);
        setPrintStatus(null);
      };
      a.readAsDataURL(e.target.files[0]);
      setFiles(e.target.files[0]);
    }
  }

  async function handlePrinting() {
    // send print request in base64 format
    const arrayBuffer = await files.arrayBuffer();
    const pdf = await PDFDocument.load(arrayBuffer);
    const pdfBytes = await pdf.saveAsBase64({ dataUri: true });
    let data = {
      raw: pdfBytes,
      // maybe we dont need to send this? since in the frontend
      // we update the embed when the user specifies which
      // pages they want to print
      // pageRanges: pageRanges && pageRanges.replace(/\s/g, ''),
      sides,
      copies,
    };
    let status = await printPage(data, props.user.token);
    if (!status.error) {
      // this should not be done in the frontend and instead be part of the printing api
      editUser(
        { ...props.user, pagesPrinted: pagesPrinted + pagesToBeUsedInPrintRequest },
        props.user.token,
      );
      setPrintStatus('Printing succeeded!');
      setPrintStatusColor('success');
    } else {
      setPrintStatus('Printing failed. Please try again or reach out to SCE Dev team if the issue persists.');
      setPrintStatusColor('error');
    }
    getNumberOfPagesPrintedSoFar();
    setTimeout(() => {
      setPrintStatus(null);
    }, 5000);
  }

  function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFiles(e.dataTransfer.files[0]);
    }
  }

  function handleDragLeave(e) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  }

  function handleDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  }

  function handleDragEnter(e) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  }

  function clearPrint() {
    setCopies(1);
    setDataUrl('');
    setPageRanges('');
    setFiles(null);
    setPrintStatus(null);
  }

  function getRemainingPageBalance() {
    return 30 - pagesPrinted;
  }

  function requestExceedsAllowedPages() {
    const remainingPageBalance = getRemainingPageBalance();
    return pagesToBeUsedInPrintRequest > (remainingPageBalance);
  }

  function renderFileUploadOrPrint() {
    if (files) {
      return (
        <div className="grid grid-cols-1 mt-0 sm:mt-16 lg:mt-5 lg:grid-cols-6 space-x-10 h-[100dvh] w-[80vw] lg:h-5/6 lg:mx-5">
          <div className='mt-16 lg:col-span-4 sm:mt-0'>
            <iframe
              title='Preview'
              className='sm:h-[calc(100vh-130px)] h-[calc(75vh-130px)] w-full lg:w-80vw'
              src={previewDisplay}
            />
          </div>
          <div className="h-auto mt-10 ml-10 lg:col-span-2 lg:mt-0">
            <div className="grid grid-cols-1 text-xl">
              {/*
                the below is a stupid bug, it uses the cookie of the user
                to determine how many pages they have printed. the cookie
                does not update unless the user signs in again. to fix
                we should ask the api to tell us the pages printined
              */}
              You have {30 - pagesPrinted} page(s) left
            </div>
            <div className="grid grid-cols-1">
              <div className="">
                <label htmlFor="copies" className="block text-sm font-medium leading-6">Number of Copies</label>
                <div className="mt-2">
                  <input
                    type="number"
                    min={0}
                    step={1}
                    value={copies}
                    name="copies"
                    id="copies"
                    className={INPUT_CLASS_NAME}
                    placeholder='intentionally blank'
                    onChange={(e) => {
                      setCopies(Number(e.target.value));
                    }}
                  />
                </div>
              </div>
              <div className="my-3 ">
                <div id=''>
                  <label htmlFor="major" className="block text-sm font-medium leading-6">
                    <span style={{ paddingRight: '10px' }}>Sides</span>
                  </label>
                  <div className="mt-2">
                    <select
                      id="sides" name="sides" className="block w-full py-2 border-0 rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                      onChange={(e) => {
                        setSides(e.target.value);
                      }}
                    >
                      {sideOptions.map((option) => {
                        return (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>
              </div>
              <div className="mt-3 mb-6 ">
                <PageSelectDropdown
                  setPageRanges={setPageRanges}
                />
              </div>
              <div className="space-x-5 ">
                {requestExceedsAllowedPages() && (
                  <div role="alert" className="mb-10 alert alert-warning">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 stroke-current shrink-0" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                    <p className=''>
                      Current print request would use {pagesToBeUsedInPrintRequest} pages which exceeds allowed limit of {getRemainingPageBalance()}
                    </p>
                  </div>
                )}
                <button className="w-3/12 btn btn-outline" onClick={clearPrint}>Cancel</button>
                <button
                  className="w-3/12 btn btn-success"
                  onClick={() => setConfirmModal(true)}
                  disabled={!pagesToBeUsedInPrintRequest || requestExceedsAllowedPages()}
                >
                  Print
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (!loading && !printerHealthy) {
      return (
        <div className='flex items-center justify-center w-full mt-10'>
          <div role="alert" className="w-1/2 text-center alert alert-error">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 stroke-current shrink-0" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <p className=''>Printing is down. Reach out to SCE Development team if refreshing doesn't fix</p>
          </div>
        </div>
      );
    }
    return (
      <div className='flex flex-col items-center w-full'>
        <div className='mx-12 mb-10'>
          <span className='flex items-center justify-center mb-5 text-3xl'>How does printing work?</span>
          <ol className="list-decimal">
            <li>Members can print up to 30 pages per week.</li>
            <li>The allowed print amount reset on Sundays.</li>
            <li>printed documents can be found in in the SCE room (ENGR 294).</li>
          </ol>
        </div>
        <form
          className="w-5/6"
          onDragEnter={handleDragEnter}
          onSubmit={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
        >
          {/* this input element allows us to select files for upload. We make it hidden so we can activate it when the user clicks select files */}
          <label
            htmlFor="dropzone-file"
            className={`flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer dark:hover:bg-bray-800 ${dragActive ? 'bg-gray-600' : 'bg-gray-700'} hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600`}
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
              </svg>
              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">PDF only, max 10MB</p>
            </div>
          </label>
          <input id="dropzone-file" type="file"
            disabled={loading}
            placeholder="fileInput"
            className="hidden"
            ref={inputRef}
            onChange={handleChange}
            accept=".pdf"
          />
        </form>
      </div>
    );
  }

  return (
    <div className='w-full'>
      <ConfirmationModal {... {
        headerText: 'Submit print request?',
        bodyText: `The request will use ${pagesToBeUsedInPrintRequest} page(s) out of the ${getRemainingPageBalance()} pages remaining.`,
        confirmText: 'Print',
        cancelText: 'Cancel',
        confirmClassAddons: 'bg-green-600 hover:bg-green-500',
        handleConfirmation: () => {
          handlePrinting();
          setConfirmModal(false);
        },
        handleCancel: () => setConfirmModal(false),
        open: confirmModal,
      }
      } />

      {printStatus && (
        <div className='flex items-center justify-center w-full mt-10'>
          <div role="alert" className={'w-1/2 text-center alert alert-' + printStatusColor}>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 stroke-current shrink-0" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 13V8m0 8h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
            <p className=''>{printStatus}</p>
          </div>
        </div>
      )}
      <div className="flex flex-col items-center justify-center min-h-[calc(100dvh-86px)]">
        {renderFileUploadOrPrint()}
      </div>
    </div>
  );
}


