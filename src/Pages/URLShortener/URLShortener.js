import React, { useEffect, useState } from 'react';


import { getAllUrls, createUrl, deleteUrl } from '../../APIFunctions/Cleezy';
import { Container, Button, Row, Col, Input } from 'reactstrap';
import { trashcanSymbol } from '../Overview/SVG';

export default function URLShortenerPage(props) {
  const [isCleezyDisabled, setIsCleezyDisabled] = useState(false);
  const [url, setUrl] = useState('');
  const [invalidUrl, setInvalidUrl] = useState();
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [useGeneratedAlias, setUseGeneratedAlias] = useState(true);
  const [alias, setAlias] = useState('');
  const [allUrls, setAllUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  const [successMessage, setSuccessMessage] = useState();
  const [aliasTaken, setAliasTaken] = useState();

  /**
   * Cleezy page is disabled by default since you have to run the Cleezy server
   * separately. To enable, go to config.json and set ENABLED under Cleezy to true
   */
  async function getCleezyUrls() {
    const urlsFromDb = await getAllUrls(props.user.token);
    setIsCleezyDisabled(!!urlsFromDb.responseData.disabled);
    if (urlsFromDb.error) {
      setError(urlsFromDb.responseData);
    } else {
      setAllUrls(urlsFromDb.responseData);
    }
    setLoading(false);
  }

  async function handleCreateUrl() {
    const response = await createUrl(url, alias, props.user.token);
    if (!response.error) {
      setAllUrls([response.responseData, ...allUrls]);
      setAliasTaken(false);
      setUrl('');
      setAlias('');
      setShowUrlInput(false);
      setSuccessMessage(`Sucessfully created shortened link ${response.responseData.link}`);
      setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
      return true;
    } else {
      setAliasTaken(true);
      return false;
    }
  }

  async function maybeSubmitUrl(url) {
    const regex =
      /^(http(s)?:\/\/)[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_.+~#?&//=]*)$/;
    if (regex.test(url)) {
      setInvalidUrl(false);
      handleCreateUrl();
    } else {
      setInvalidUrl(true);
      return false;
    }
  }

  async function handleDeleteUrl(alias) {
    const response = await deleteUrl(alias, props.user.token);
    if (!response.error) {
      setAllUrls(allUrls.filter(url => url.alias !== alias));
    }
  }

  useEffect(() => {
    getCleezyUrls();
  }, []);

  useEffect(() => {
    if (!useGeneratedAlias) {
      setAlias('');
    }
  }, [useGeneratedAlias]);

  useEffect(() => {
    if (!showUrlInput) {
      setAlias('');
      setUrl('');
    }
  }, [showUrlInput]);

  useEffect(() => {
    setInvalidUrl(false);
  }, [url]);

  function maybeRenderErrorAlert() {
    if (invalidUrl) {
      return (
        <div role="alert" className="alert alert-error sm:col-span-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span>Please enter a valid URL.</span>
        </div>
      );
    }
    if (aliasTaken) {
      return (
        <div role="alert" className="alert alert-error sm:col-span-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span>The alias "{alias}" already in use.</span>
        </div>
      );
    }
  }

  function renderUrlButtonOrForm() {
    if (!showUrlInput) {
      return (
        <div className='pb-10'>
          <button
            className="btn btn-outline"
            onClick={() => setShowUrlInput(true)}
          >
            + Create a new link
          </button>
        </div>
      );
    }

    return (<div>
      <div className="space-y-12">
        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-base font-semibold leading-7 text-gray-900">
            Create a new link
          </h2>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 grid-cols-full sm:grid-cols-6">
            {maybeRenderErrorAlert()}
            <div className="col-span-full sm:col-span-4">
              <label htmlFor="url" className="block text-sm font-medium leading-6 text-gray-900">
                Original URL
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="url"
                  id="url"
                  placeholder="https://example.com"
                  value={url}
                  onChange={e => setUrl(e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="col-span-3">
              <div className="form-control">
                <label className="label cursor-pointer">
                  <span className="label-text">Use Generated Alias</span>
                  <input type="checkbox" className="toggle" checked={useGeneratedAlias} onChange={(e) => setUseGeneratedAlias(e.target.checked)} />
                </label>
              </div>
            </div>
            {!useGeneratedAlias && (

              <div className="sm:col-span-4">
                <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                  Alias
                </label>
                <div className="mt-2">
                  <input
                    id="alias"
                    name="alias"
                    value={alias}
                    onChange={e => setAlias(e.target.value)}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button
          onClick={() => setShowUrlInput(false)} type="button" className="text-sm font-semibold leading-6 text-gray-900">
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          // disable button if the url is blank or if we are using an alias and its blank
          disabled={!url || (!useGeneratedAlias && !alias)}
          onClick={() => maybeSubmitUrl(url)}
        >
          Save
        </button>
      </div>
    </div>);
  }

  if (isCleezyDisabled) {
    return (
      <div className='container mx-auto px-10 pt-10'>
        <h1 className='text-3xl subpixel-antialiased'>
          Cleezy page is disabled.
        </h1>
        <p>To enable:</p>
        <ol className='list-decimal'>
          <li>Modify <pre>api/config/config.json</pre> to include
            <code>
              'Cleezy': &#123;
              'ENABLED': true
              &#125;
            </code>
          </li>
          <li>
            Clone Cleezy locally and follow the steps in
            {' '}<a href="https://github.com/SCE-Development/cleezy#readme" target="_blank">
              the readme
            </a> to run locally.
          </li>
          <li>
            Run Clark and log in with an Admin account.
          </li>
        </ol>
      </div>
    );
  }

  if (error) {
    return (
      <div className='container mx-auto px-10 pt-10'>
        <h1 className='text-3xl subpixel-antialiased'>
          Unable to load URL table:
        </h1>
        <p>{String(error)}</p>
      </div>
    );
  }

  return (
    // the below input layout is taken from
    // https://tailwindui.com/components/application-ui/forms/form-layouts
    <div className='container mx-auto px-10 pt-10'>
      {!loading && (
        <div className='body-container'>
          {renderUrlButtonOrForm()}
          {successMessage &&
            <div className='pb-10'>
              <div role="alert" className="alert alert-success">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span>{successMessage}</span>
              </div>
            </div>
          }
          <div className='overflow-x-auto transition'>
            <h1>List of URLs:</h1>
            <table className='table table-xs'>
              <thead>
                <tr>
                  {[
                    { title: 'Url', },
                    { title: 'Alias', },
                    { title: 'Link', className: 'hidden md:flex'},
                    { title: '' },
                  ].map((element) => {
                    return <th key={element.title} className={element.className}>{element.title}</th>;
                  })}
                </tr>
              </thead>

              <tbody>
                {allUrls.map((url, index) => {
                  return (
                    <tr key={index}>
                      <td className='break-all w-8/12 md:w-auto'>{url.url}</td>
                      <td>
                        <span className='hidden md:flex'>
                          {url.alias}
                        </span>
                        <span className='flex md:hidden text-blue-600 hover:underline'>
                          <a href={url.link} target="_blank" rel="noopener noreferrer">
                            {url.alias}
                          </a>
                        </span>
                      </td>
                      <td className='hidden md:flex'>
                        <span className='text-blue-600 hover:underline'>
                          <a href={url.link} target="_blank" rel="noopener noreferrer">
                            {url.link}
                          </a>
                        </span>
                      </td>
                      <td>
                        <button
                          onClick={() => handleDeleteUrl(url.alias)}>
                          {trashcanSymbol()}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
