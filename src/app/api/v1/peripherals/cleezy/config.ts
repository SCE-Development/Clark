

export const ENABLED = false;
export const CLEEZY_URL = process.env.CLEEZY_URL
  || 'http://localhost:8000';
export const URL_SHORTENER_BASE_URL =
  process.env.NODE_ENV === 'production' ? 'https://sce.sjsu.edu/s/' : 'http://localhost:8000/find/';