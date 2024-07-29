import React, { useState, useEffect, useRef } from 'react';
import PageSelectDropdown from './PageSelectDropdown';
import {
  parseRange,
  printPage,
  getPagesPrinted,
} from '../../APIFunctions/2DPrinting';
import { editUser } from '../../APIFunctions/User';

import { PDFDocument } from 'pdf-lib';
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
  const [PdfFile, setPdfFile] = useState(null);

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
      const file = new File([pdfBytes], files.name, { type: 'application/pdf' });
      const objectUrl = URL.createObjectURL(file);
      setNumberOfPagesInPdfPreview(display.getPages().length);
      setPreviewDisplay(objectUrl);
      setPdfFile(file);
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


  //  create the preview for image
  async function getUriImage() {
    // create a new pdf document
    const display = await PDFDocument.create();
    // embed the image into the pdf
    let image = undefined;
    const mediaType = dataUrl.split(';')[0].split(':')[1].split('/')[1];
    if (mediaType === 'jpg' || mediaType === 'jpeg') {
      // return the PDFImage object
      image = await display.embedJpg(dataUrl);
    } else if (mediaType === 'png') {
      image = await display.embedPng(dataUrl);
    }
    // scale the image to 25% of its original size
    const imgDims = image.scale(0.25);
    // add a blank page to the pdf document
    const page = display.addPage();
    // draw the image in the center of the page
    page.drawImage(image,
      {
        x: page.getWidth() / 2 - imgDims.width / 2,
        y: page.getHeight() / 2 - imgDims.height / 2,
        width: imgDims.width,
        height: imgDims.height
      }
    );
    // serialize the image into a byte array (Unit8Array)
    const pdfBytes = await display.save();
    // create a File object from the byte array
    const file = new File([pdfBytes], files.name, { type: 'application/pdf' });
    // generate a Blob URL for the preview
    const objectUrl = URL.createObjectURL(file);
    setNumberOfPagesInPdfPreview(display.getPages().length);
    setPreviewDisplay(objectUrl);
    setPdfFile(file);
  }

  async function getUriTxt() {
    try {
      // if there is a file
      if (files) {
        // use file reader to read the file
        const reader = new FileReader();
        reader.onload = async function(e) {
          // get the content of the file
          const text = e.target.result;
          // split the content by new line
          const lines = text.split('\n');
          // create a new pdf document
          const display = await PDFDocument.create();
          // add the first page to the pdf document
          let page = display.addPage();
          // get width and height of the page
          const pageHeight = page.getHeight();
          const pageWidth = page.getWidth();
          // embed the font into the pdf
          const font = await display.embedFont('Helvetica');
          // define the font size, line height, and margin, maxWidth, maxHeight
          const fontSize = 12;
          const lineHeight = fontSize * 1.5;
          const margin = 50;
          const maxWidth = pageWidth - 2 * margin;
          const maxHeight = pageHeight - 2 * margin;
          // define the initial y position
          let yPosition = pageHeight - margin;
          // iterate through each line
          lines.forEach((line, index) => {
            // if the line is the white space, go to next line
            if (line === '') {
              yPosition -= lineHeight;
            }
            else { // if the line has words in it
            // separate each word in the line by space
            const words = line.split(' ');
            // define a variable to store the content that will be inserted at the current line
            let currentLine = '';
            // iterate through each word
            words.forEach((word) => {
              // define a temp variable to store the current line with the new word
              const testLine = currentLine + (currentLine ? ' ' : '') + word;
              // get the width of the temp variable
              const width  = font.widthOfTextAtSize(testLine, fontSize);
              // if the width is less than or equal to the max width, add the word to the content that will be inserted at the current line
              if (width <= maxWidth) {
                currentLine = testLine;
              } else { // if the width is greater than the max width
                // two scenerios can happen
                // 1. the overflow is a whole word
                if (currentLine) {
                  // insert the content that will not include the overflown word
                  page.drawText(currentLine, {
                    x: margin,
                    y: yPosition,
                    font: font,
                    size: fontSize
                  });
                  // add the new word to the content that will be inserted in the next line 
                  currentLine = word
                  // go to the next line
                  yPosition -= lineHeight;
                }
               // 2. the overflow is a part of the word
               else {
                // define a temp variable to store the content that will be inserted at the current line
                let tempLine = '';
                // iterate through each character in the word
                for (let i = 0; i < testLine.length; i++) {
                  // add the character to the temp variable
                  tempLine += testLine[i];
                  // get the width of the temp variable with a hyphen at the end;
                  const tempWidth = font.widthOfTextAtSize(tempLine + '-', fontSize);
                  // if the temp width is greater than the max width, overflow happened
                  if (tempWidth > maxWidth) {
                    // insert the current added characters to the current line with the hypen at the end
                    page.drawText(tempLine + '-', {
                      x: margin,
                      y: yPosition,
                      font: font,
                      size: fontSize
                    });
                    // go to the next line
                    yPosition -= lineHeight;
                    // reset the temp variable
                    tempLine = '';
                  }
                  // we need this if statement to insert all overflown characters
                  if (i === testLine.length - 1 && tempWidth <= maxWidth) {
                    page.drawText(tempLine, {
                      x: margin,
                      y: yPosition,
                      font: font,
                      size: fontSize
                    });
                    yPosition -= lineHeight;
                  }
                }
               }
              }
              // if the y position is less than the margin, add a new page
              if (yPosition < margin) {
                yPosition = pageHeight - margin;
                page = display.addPage();
              }
            })
            // if after adding all the words in the line and overflow did not happen, insert the content to the current line
            if (currentLine) {
              page.drawText(currentLine, {
                x: margin,
                y: yPosition,
                font: font,
                size: fontSize
              });
              // go to the next line
              yPosition -= lineHeight;
            }
            // if the y position is less than the margin and the current line is the not the last, add a new page
            if (yPosition < margin && index !== lines.length - 1) {
              yPosition = pageHeight - margin;
              page = display.addPage();
            }
          }
          });
          // serialize the image into a byte array (Unit8Array)
          const pdfBytes = await display.save();
          // create a File object from the byte array
          const file = new File([pdfBytes], files.name, { type: 'application/pdf' });
          // generate a Blob URL for the preview
          const objectUrl = URL.createObjectURL(file);
          setNumberOfPagesInPdfPreview(display.getPages().length);
          setPreviewDisplay(objectUrl);
          setPdfFile(file);
        }
        reader.readAsText(files); 
      } 
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    if (dataUrl) {
      // get the file type
      const mediaType = dataUrl.split(';')[0].split(':')[1].split('/')[1];
      console.log(mediaType)
      // if the file type is pdf
      if (
        mediaType === 'pdf'
      ) {
        getUri();
      } else if ( // if the file type is an image
        ['jpg',  'png',  'jpeg'].includes(mediaType)
      ) {
        getUriImage();
      }
      else if (
        ['plain'].includes(mediaType)
      )
      {
        getUriTxt();
      }
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
    // send print request with files and configuratiosn in formData
    const data = new FormData();
    data.append('file', PdfFile);
    data.append('sides', sides);
    data.append('copies', copies);
    let status = await printPage(data, props.user.token);

    if (!status.error) {
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
      let a = new FileReader();
      a.onload = function(event) {
        setDataUrl(event.target.result);
        setPrintStatus(null);
      };
      a.readAsDataURL(e.dataTransfer.files[0]);
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
            accept=".pdf, .jpg, .jpeg, .png, .txt"
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
        handleCancel: () => {
          setDataUrl('');
          setFiles(null);
          setConfirmModal(false);
        },
        open: confirmModal,
      }
      }/>

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


