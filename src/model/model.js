import { fetchCompanies, fetchOrders, fetchUsers } from '../api/dataBaseAPI';

class Model {
  orders = null;
  users = null;
  companies = null;

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
}

export default new Model();