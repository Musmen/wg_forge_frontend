import { getCardNumberMask, getOrderTime, getUserFullName, getUserPrefix } from '../common/helpers';

class View {
  tableBody = null;

  init() {
    this.tableBody = document.querySelector('.table-body');
  }

  renderOrders(orders, users) {
    const ordersFragment = new DocumentFragment();
    orders.forEach(order => ordersFragment.append(this.renderOrderTableRow(order, users)));
    this.tableBody.append(ordersFragment);
  }

  renderOrderTableRow(order, users) {
    const orderTableRow = document.createElement('tr');

    orderTableRow.className='table-row';
    orderTableRow.id=`order_${order.id}`;

    orderTableRow.insertAdjacentHTML('beforeend',
      `<td class="order-transaction-id">${order.transaction_id}</td>
      <td class="order-user-data user_data">${this.renderUserCellLink(order.user_id, users)}</td>
      <td class="order-date">${getOrderTime(order.created_at)}</td>
      <td class="order-total">$${order.total}</td>
      <td class="order-card-number">${getCardNumberMask(order.card_number)}</td>
      <td class="order-card-type">${order.card_type}</td>
      <td class="order-location">${order.order_country} (${order.order_ip})<td>`
    )

    return orderTableRow;
  }

  renderUserCellLink(orderUserId, users) {
    const currentUser = users.find(user => user.id === orderUserId);
    return `<a href="#">${getUserPrefix(currentUser)} ${getUserFullName(currentUser)}</a>`
  }
}

export default new View();