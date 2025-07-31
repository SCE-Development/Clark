const axios = require('axios');
const {
  SERVER_ERROR,
} = require('../../util/constants.js').STATUS_CODES;
const logger = require('../../util/logger.js');

let CLEEZY_URL = process.env.CLEEZY_URL
  || 'http://localhost:8000';
let URL_SHORTENER_BASE_URL =
  process.env.NODE_ENV === 'production' ? 'https://sce.sjsu.edu/s/' : 'http://localhost:8000/find/';

const searchCleezyUrls = async ({ page, search, sortColumn, sortOrder, limit }) => {
  try {
    const cleezyQuery = search?.replace(/[^a-zA-Z0-9]/g, '');
    const cleezyRes = await axios.get(CLEEZY_URL + '/list', {
      params: {
        page,
        ...(cleezyQuery !== undefined && { search: cleezyQuery }),
        // eslint-disable-next-line camelcase
        sort_by: sortColumn,
        order: sortOrder,
      }
    });
    const { data = [], total, rows_per_page: rowsPerPage } = cleezyRes.data;
    const cleezyData = data
      .slice(0, limit)
      .map(e => {
        const u = new URL(e.alias, URL_SHORTENER_BASE_URL);
        return { ...e, link: u.href };
      });

    return { data: cleezyData, total, rowsPerPage };
  } catch (err) {
    logger.error('cleezyHelpers had an error', err);
    if (err.response && err.response.data) {
      return {
        status: err.response.status,
        error: err.response.data
      };
    } else {
      return {
        status: SERVER_ERROR,
        error: 'Failed to list URLs in cleezyHelpers'
      };
    }
  }
};

module.exports = {searchCleezyUrls};
