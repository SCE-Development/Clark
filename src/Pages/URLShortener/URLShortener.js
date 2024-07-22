import React, { useEffect, useState } from 'react';


import { getAllUrls, createUrl, deleteUrl } from '../../APIFunctions/Cleezy';
import { trashcanSymbol } from '../Overview/SVG';
import ConfirmationModal from '../../Components/DecisionModal/ConfirmationModal.js';

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
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState(null);
  const [invalidSearch, setInvalidSearch] = useState(false);
  const [errorAlertMessage, setErrorAlertMessage] = useState('');
  const [urlToDelete, setUrlToDelete] = useState({});
  const [toggleDelete, setToggleDelete] = useState(false);
  const [currentSortColumn, setCurrentSortColumn] = useState(null);
  const [currentSortOrder, setCurrentSortOrder] = useState(null);

  const INPUT_CLASS = 'indent-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 text-white';
  const LABEL_CLASS = 'block text-sm font-medium leading-6 text-gray-300';

  /**
   * Cleezy page is disabled by default since you have to run the Cleezy server
   * separately. To enable, go to config.json and set ENABLED under Cleezy to true
   */
  async function getCleezyUrls(page, searchQuery, currentSortColumn, currentSortOrder) {
    setLoading(true);
    const sortColumn = currentSortColumn ?? 'created_at';
    const sortOrder = currentSortOrder ?? 'DESC';
    const urlsFromDb = await getAllUrls({
      token: props.user.token,
      page: page,
      searchQuery: searchQuery,
      sortColumn: sortColumn,
      sortOrder: sortOrder
    });
    setIsCleezyDisabled(!!urlsFromDb.responseData.disabled);
    if (urlsFromDb.error) {
      setError(urlsFromDb.responseData);
    } else {
      setAllUrls(urlsFromDb.responseData.data);
      setTotal(urlsFromDb.responseData.total - 1);
      setRowsPerPage(urlsFromDb.responseData.rowsPerPage);
    }
    setLoading(false);
  }

  async function handleCreateUrl() {
    const response = await createUrl(
      url.trim(),
      alias.trim(),
      props.user.token
    );
    if (!response.error) {
      setAllUrls([...allUrls, response.responseData]);
      setAliasTaken(false);
      setUrl('');
      setAlias('');
      setShowUrlInput(false);
      setTotal(total + 1);
      setSuccessMessage(`Sucessfully created shortened link ${response.responseData.link}`);
      setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
      return true;
    } else {
      setAliasTaken(true);
      setErrorAlertMessage('That alias is taken!');
      return false;
    }
  }

  async function maybeSubmitUrl() {
    const regex =
      /^(http(s)?:\/\/)[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_.+~#?&//=]*)$/;
    if (regex.test(url.trim())) {
      setInvalidUrl(false);
      handleCreateUrl();
    } else {
      setInvalidUrl(true);
      setErrorAlertMessage('URL must be valid');
      return false;
    }
  }

  async function maybeSubmitSearch() {
    const regex = /^[a-zA-Z0-9]+$/;
    if (searchQuery === '' || regex.test(searchQuery)) {
      setInvalidSearch(false);
      getCleezyUrls(page, searchQuery);
    } else {
      setInvalidSearch(true);
      setErrorAlertMessage('Search query cannot contain special characters');
      return false;
    }
    if (loading && !allUrls.length) {
      return <div></div>;
    }
  }

  async function handleDeleteUrl(alias) {

    const response = await deleteUrl(alias, props.user.token);
    if (!response.error) {
      setAllUrls(allUrls.filter(url => url.alias !== alias));
      setTotal(total - 1);
    }
  }

  function handleSortUrls(columnName) {
    if (columnName === null) {
      return;
    }
    if(currentSortColumn === columnName) {
      if (currentSortOrder === 'ASC') {
        setCurrentSortOrder('DESC');
      } else if (currentSortOrder === 'DESC') {
        setCurrentSortOrder(null);
        setCurrentSortColumn(null);
      }
    } else {
      setCurrentSortColumn(columnName);
      setCurrentSortOrder('ASC');
    }
  }

  function handleArrowVisibility(sortOrder, columnName) {
    if (currentSortOrder === sortOrder && currentSortColumn === columnName)
      return '';
    return 'hidden';
  }


  useEffect(() => {
    if (useGeneratedAlias) {
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

  useEffect(() => {
    setInvalidSearch(false);
  }, [searchQuery]);

  useEffect(() => {
    setAliasTaken(false);
  }, [alias]);

  useEffect(() => {
    getCleezyUrls(page, searchQuery, currentSortColumn, currentSortOrder);
  }, [page, currentSortColumn, currentSortOrder]);

  function maybeRenderErrorAlert() {
    if (invalidUrl || aliasTaken || invalidSearch) {
      return (
        <div role="alert" className="alert alert-error sm:col-span-4 mt-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span>{ errorAlertMessage }</span>
        </div>
      );
    }
  }

  function maybeRenderPagination() {
    const amountOfUrlsOnPage = Math.min((page + 1) * rowsPerPage, allUrls.length);
    const pageOffset = page * rowsPerPage;
    const endingElementNumber = amountOfUrlsOnPage + pageOffset;
    const startingElementNumber = (page * rowsPerPage) + 1;
    if (!allUrls.length) {
      return <></>;
    } else {
      return (
        <nav className='flex justify-start mt-2 mb-6 mx-6'>
          <div className='navbar-start flex items-center'>
            <span>
              {loading ? '...' : (<>
                <p className='md:hidden'>
                  {startingElementNumber} - {endingElementNumber} / {total}
                </p>
                <p className="hidden md:inline-block">
          Showing <span className='font-medium'>{startingElementNumber}</span> to <span className='font-medium'>{endingElementNumber}</span> of <span className='font-medium'>{total + 1}</span> results
                </p>
              </>)}
            </span>
          </div>
          <div className='navbar-end flex justify-end space-x-3'>
            <button
              className='btn'
              onClick={() => setPage(page - 1)}
              disabled={page === 0 || loading}
            >
              previous
            </button>
            <button
              className='btn'
              onClick={() => setPage(page + 1)}
              disabled={endingElementNumber >= total || loading}
            >
              next
            </button>
          </div>
        </nav>
      );
    }
  }

  function renderUrlButtonOrForm() {
    if (!showUrlInput) {
      return (
        <button
          className="btn btn-outline"
          onClick={() => setShowUrlInput(true)}
        >
          + Create a new link
        </button>
      );
    }

    return (<div>
      <div className="space-y-12">
        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-base font-semibold leading-7 text-gray-300">
            Create a new link
          </h2>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 grid-cols-full sm:grid-cols-6">
            <div className="col-span-full sm:col-span-4">
              <label htmlFor="url" className={LABEL_CLASS}>
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
                  className={INPUT_CLASS}
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
                <label htmlFor="email" className={LABEL_CLASS}>
                  Alias
                </label>
                <div className="mt-2">
                  <input
                    id="alias"
                    name="alias"
                    value={alias}
                    onChange={e => setAlias(e.target.value)}
                    className={INPUT_CLASS}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button
          onClick={() => setShowUrlInput(false)} type="button" className="text-sm font-semibold leading-6 text-gray-300">
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          // disable button if the url is blank or if we are using an alias and its blank
          disabled={!url || (!useGeneratedAlias && !alias)}
          onClick={() => maybeSubmitUrl()}
        >
          Save
        </button>
      </div>
    </div>);
  }

  function maybeRenderSearch() {
    return (
      <><div className="label">
        <span className="label-text text-md">Type a search, followed by the enter key</span>
      </div><input
        className="w-full text-sm input input-bordered sm:text-base"
        type="text"
        value={searchQuery}
        placeholder="search by alias or url"
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            event.preventDefault();
            // instead of calling the backend directory, set
            // the page we are on to zero if the current page
            // we are on isn't the first page (value of 0).
            // by doing this, the useEffect will call the backend
            // for us with the correct page and query.
            if (page) {
              setPage(0);
            } else {
              maybeSubmitSearch();
            }
          }
        } }
        onChange={event => {
          setSearchQuery(event.target.value);
        } } /></>
    );
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
    <div className='overview-container bg-gradient-to-r from-gray-800 to-gray-600 min-h-[100dvh]'>
      <ConfirmationModal {... {
        headerText: `Delete ${urlToDelete.alias} for ${urlToDelete.url} ?`,
        bodyText: `Are you sure you want to delete 
          ${urlToDelete.alias}? It'll be gone forever if you do.`,
        confirmText: `Yes, delete ${urlToDelete.alias}`,
        confirmClassAddons: 'bg-red-600 hover:bg-red-500',
        handleConfirmation: () => {
          handleDeleteUrl(urlToDelete.alias);
          setToggleDelete(false);
        },
        handleCancel: () => {
          setToggleDelete(false);
        },
        open: toggleDelete
      }
      } />
      <div className='px-4'>
        <div className='body-container'>
          {maybeRenderErrorAlert()}
          {successMessage &&
            <div>
              <div role="alert" className="alert alert-success mt-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="text-white fill-none stroke-current shrink-0 h-6 w-6" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span className='text-white'>{successMessage}</span>
              </div>
            </div>
          }
          <div className='p-6 mt-6 border rounded-lg border-white/10'>
            {renderUrlButtonOrForm()}
          </div>
          <div className='px-6 mt-6 border rounded-lg border-white/10'>
            <div className='py-6'>
              {maybeRenderSearch()}
            </div>
            <div className='overflow-x-auto transition'>
              <table className='table px-3'>
                <thead>
                  <tr>
                    {[
                      { title: 'URL', className: 'text-base text-white/70', columnName: 'alias' },
                      { title: 'Created At', className: 'text-base text-white/70 hidden text-center sm:table-cell', columnName: 'created_at' },
                      { title: 'Times Used', className: 'text-base text-white/70 text-center', columnName: 'used' },
                      { title: 'Delete', className: 'text-base text-white/70 text-center' }
                    ].map(({ title, className, columnName = null }) => (
                      <th
                        className={`${className}`}
                        key={title}
                      >
                        <div className="flex items-center justify-center">
                          <button onClick={() => handleSortUrls(columnName)}>{title}</button>
                          <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth='1.5' stroke='currentColor' className={`w-5 h-5 ${handleArrowVisibility('ASC', columnName)}`}>
                            <path strokeLinecap='round' strokeLinejoin='round' d='M12 19.5V4.5m0 0l-6 6m6-6l6 6' />
                          </svg>
                          <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth='1.5' stroke='currentColor' className={`w-5 h-5 ${handleArrowVisibility('DESC', columnName)}`}>
                            <path strokeLinecap='round' strokeLinejoin='round' d='M12 4.5v15m0 0l6-6m-6 6l-6-6' />
                          </svg>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {allUrls.map((url, index) => {
                    return (
                      <tr className='break-all !rounded md:break-keep hover:bg-white/10' key={index}>
                        <td className=''>
                          <a className='link link-hover link-info' target="_blank" rel="noopener noreferrer" href={`${url.link}`}>
                            {url.alias}
                          </a>
                          <p>{url.url.length > 60 ? url.url.slice(0, 50) + '...' : url.url}</p>
                        </td>
                        <td className='hidden md:table-cell'>
                          <div className='flex items-center justify-center'>
                            {new Date(url.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}                            </div>
                        </td>
                        <td className='hidden md:table-cell'>
                          <div className='flex items-center justify-center'>
                            {url.used}
                          </div>
                        </td>
                        <td>
                          <div className='flex items-center justify-center'>
                            <button
                              className ='p-2 hover:bg-white/30 rounded-xl'
                              onClick={() => {
                                setUrlToDelete(url); setToggleDelete(true);
                              }}>
                              {trashcanSymbol()}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {allUrls.length === 0 && (
                <div className='flex flex-row w-100 justify-center'>
                  <p className='text-lg text-white/70 mt-5 mb-5'>No results found!</p>
                </div>
              )}
              {maybeRenderPagination()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
