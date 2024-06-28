import React, {useState, useEffect} from 'react';
import { getApiKey } from '../../../APIFunctions/User';

const GetApiKeyModal = (props) => {
  const { bannerCallback = () => {} } = props;
  const [apiKey, setApiKey] = useState('');

  const INPUT_CLASS_NAME = 'indent-2 block w-full rounded-md border-0 py-1.5   shadow-sm ring-1 ring-inset ring-gray-300 placeholder:  focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 text-white';

  async function generateKey() {
    const apiResponse = await getApiKey(props.user.token);

    if (!apiResponse.error) {
      setApiKey(apiResponse.responseData.apiKey);
    } else {
      bannerCallback(apiResponse.errror);
    }
  }

  useEffect(() => {
    if (!props.user.apiKey !== '') {
      setApiKey(props.user.apiKey);
    }
  }, [props]);



  return (
    <dialog id="get-apikey-modal" className="modal modal-bottom sm:modal-middle">
      <div className='modal-box'>
        <h3 className="font-bold text-lg"> Get API Key </h3>
        <label htmlFor="generate-apikey" className="block text-sm font-medium leading-6 mt-2">
                API Key:
        </label>
        <div>
          <input
            value={apiKey || ''}
            id="generate-apikey"
            name="generate-apikey"
            className={INPUT_CLASS_NAME}
            readOnly
          />
        </div>


        <div className="modal-action">
          <div className="px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            <button
              onClick={() => generateKey()}
              className={'btn inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm sm:ml-3 sm:w-auto'}                    >
                    Generate Key
            </button>
            <form method="dialog">

              <button className="btn mt-3 inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold shadow-sm ring-1 ring-inset sm:mt-0 sm:w-auto">
                  Cancel
              </button>
            </form>
          </div>
        </div>
      </div>

    </dialog>
  );
};

export default GetApiKeyModal;
