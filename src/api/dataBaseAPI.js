import { fetchData } from '../common/helpers';

const DB_API_BASE_URL = 'http://localhost:9000/api/';

const DB_API_URLS = {
  ORDERS: `${DB_API_BASE_URL}orders.json`,
  USERS: `${DB_API_BASE_URL}users.json`,
  COMPANIES: `${DB_API_BASE_URL}companies.json`,
}

export const fetchOrders = () => fetchData(DB_API_URLS.ORDERS);
export const fetchUsers = () => fetchData(DB_API_URLS.USERS);
export const fetchCompanies = () => fetchData(DB_API_URLS.COMPANIES);