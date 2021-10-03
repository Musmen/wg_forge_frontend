import { fetchOrders } from '../api/dataBaseAPI';

class Model {
  orders = null;

  getOrders() {
    return fetchOrders()
      .then(
        orders => this.orders = orders
      );
  }

}

export default new Model();