import { fetchOrders, fetchUsers } from '../api/dataBaseAPI';

class Model {
  orders = null;
  users = null;

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

}

export default new Model();