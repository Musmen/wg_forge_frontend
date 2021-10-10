import { fetchCompanies, fetchOrders, fetchUsers } from '../api/dataBaseAPI';
import { fetchCurrencyRates, fetchCurrencySymbols } from '../api/exchangeRatesAPI';
import { getCurrentUserById, getUserCompanyById } from '../common/helpers';

class Model {
  orders = null;
  users = null;
  companies = null;

  ordersForView = null;

  currencySymbols = null;
  currencyRates = null;

  init() {
    return Promise.all([
      this.getFullTableData(),
      this.getCurrencyExchangeData(),
    ])
  }

  getOrders() {
    return fetchOrders()
      .then(
        orders => this.orders = orders
      );
  }

  getUsers() {
    return fetchUsers()
      .then(
        users => this.users = users
      );
  }

  getCompanies() {
    return fetchCompanies()
      .then(
        companies => this.companies = companies
      );
  }

  getFullTableData() {
    return Promise.all([
      this.getOrders(),
      this.getUsers(),
      this.getCompanies(),
    ])
      .then(() => this.setOrdersForView());
  }

  setOrdersForView() {
    this.ordersForView = this.orders.map(
      order => {
        const currentUser = getCurrentUserById(this.users, order.user_id);
        const userCompany = getUserCompanyById(this.companies, currentUser.company_id);
        return { order, currentUser, userCompany };
      }
    );
  }

  getOrdersForView() {
    return this.ordersForView;
  }

  getCurrencyRates() {
    return fetchCurrencyRates()
      .then(
        currencyRates => this.currencyRates = currencyRates.rates
      );
  }

  getCurrencySymbols() {
    return fetchCurrencySymbols()
      .then(
        currencySymbols => this.currencySymbols = currencySymbols.symbols
      );
  }

  getCurrencyExchangeData() {
    return Promise.all([
      this.getCurrencyRates(),
      this.getCurrencySymbols(),
    ]);
  }
}

export default new Model();