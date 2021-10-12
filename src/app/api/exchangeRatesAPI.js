import { fetchData } from '../common/helpers';

const EXCHANGE_RATES_API_BASE_URL = 'http://api.exchangeratesapi.io/';
const ACCESS_KEY = 'd654ac443b3e5f4923dd7ae5fdaf438b';

const getApiURL = (endpoint) => `${EXCHANGE_RATES_API_BASE_URL}${endpoint}?access_key=${ACCESS_KEY}`;

const EXCHANGE_RATES_API_URLS = {
  SYMBOLS: getApiURL('symbols'),
  RATES: getApiURL('latest'),
};

export const fetchCurrencySymbols = () => fetchData(EXCHANGE_RATES_API_URLS.SYMBOLS);
export const fetchCurrencyRates = () => fetchData(EXCHANGE_RATES_API_URLS.RATES);
