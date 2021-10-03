import { getCardNumberMask, getOrderTime } from '../common/helpers';

class View {
  tableBody = null;

  init() {
    this.tableBody = document.querySelector('.table-body');
  }

  renderOrders(orders) {
    const ordersFragment = new DocumentFragment();
    orders.forEach(order => ordersFragment.append(this.renderOrderTableRow(order)));
    this.tableBody.append(ordersFragment);
  }

  renderOrderTableRow(order) {
    const orderTableRow = document.createElement('tr');

    orderTableRow.className='table-row';
    orderTableRow.id=`order_${order.id}`;
    
    orderTableRow.insertAdjacentHTML('beforeend',
      `<td class="order-transaction-id">${order.transaction_id}</td>
      <td class="order-user-data">${order.user_id}</td>
      <td class="order-date">${getOrderTime(order.created_at)}</td>
      <td class="order-total">$${order.total}</td>
      <td class="order-card-number">${getCardNumberMask(order.card_number)}</td>
      <td class="order-card-type">${order.card_type}</td>
      <td class="order-location">${order.order_country} (${order.order_ip})<td>`
    )

    return orderTableRow;
  }
}

export default new View();