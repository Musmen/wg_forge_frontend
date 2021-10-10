import { fetchCompanies, fetchOrders, fetchUsers } from '../api/dataBaseAPI';
import { getCurrentUserById, getUserCompanyById } from '../common/helpers';

class Model {
  orders = null;
  users = null;
  companies = null;

  ordersForView = null;

  init() {
    return this.getFullTableData();
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
}

export default new Model();