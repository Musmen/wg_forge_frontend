import { CLASS_NAMES, SORTED_LABEL } from '../common/constants';
import { 
  getCardNumberMask, getOrderTime, getUserFullName, getUserPrefix, getUserBirthday,
} from '../common/helpers';

class View {
  listenersList = []

  table = null;
  tableBody = null;
  tableHead = null;
  sortedMark = null;

  init() {
    this.sortedMark = document.createElement('span');
    this.sortedMark.innerHTML = SORTED_LABEL;

    this.table = document.querySelector(`.${CLASS_NAMES.TABLE.MAIN}`);
    this.tableBody = this.table.querySelector(`.${CLASS_NAMES.TABLE.BODY}`);
    this.tableHead = this.table.querySelector(`.${CLASS_NAMES.TABLE.HEAD}`);
  }

  removeAllHandlers() {
    this.listenersList.forEach((listener) => {
      this.table.removeEventListener(listener.event, listener.handler);
    });
  }

  clearOrdersTable() {
    this.removeAllHandlers();
    this.tableBody.innerHTML = '';
  }

  addUserLinkOnClickHandler(userLinkOnClickHandler) {
    this.tableBody.addEventListener('click', userLinkOnClickHandler);
    this.listenersList.push({event: 'click', handler: userLinkOnClickHandler});
  }

  addTableHeadkOnClickHandler(tableHeadOnClickHandler) {
    this.tableHead.addEventListener('click', tableHeadOnClickHandler);
    this.listenersList.push({event: 'click', handler: tableHeadOnClickHandler});
  }

  addSortedMark(element) {
    element.insertAdjacentElement('beforeend', this.sortedMark);
  }

  renderOrders(ordersForView) {
    const ordersFragment = new DocumentFragment();

    ordersForView.forEach(
      ({ order, currentUser, userCompany }) => {
        ordersFragment.append(
          this.renderOrderTableRow(order, currentUser, userCompany)
        )
      }
    );
    
    this.tableBody.append(ordersFragment);
  }

  renderOrderTableRow(order, currentUser, userCompany) {
    const orderTableRow = document.createElement('tr');

    orderTableRow.className='table-row';
    orderTableRow.id=`order_${order.id}`;

    orderTableRow.insertAdjacentHTML('beforeend',
      `<td class="order-transaction-id">
        ${order.transaction_id}
      </td>
      <td class="order-user-data user-data">
        ${this.renderUserCell(currentUser, userCompany)}
      </td>
      <td class="order-date">
        ${getOrderTime(order.created_at)}
      </td>
      <td class="order-total">
        $${order.total}
      </td>
      <td class="order-card-number">
        ${getCardNumberMask(order.card_number)}
      </td>
      <td class="order-card-type">
        ${order.card_type}
      </td>
      <td class="order-location">
        ${order.order_country} (${order.order_ip})
      </td>`
    )

    return orderTableRow;
  }

  renderUserCell(currentUser, userCompany) {
    return `
      ${this.renderUserLink(currentUser)}
      ${this.renderUserDetails(currentUser, userCompany)}`;
  }

  renderUserLink(currentUser) {
    return `<a class="user-link" href="#">${getUserPrefix(currentUser)} ${getUserFullName(currentUser)}</a>`
  }

  renderUserDetails(currentUser, userCompany) {
    return `
    <div class="user-details hide">
      ${this.renderUserBirthday(currentUser)}
      ${this.renderUserAvatar(currentUser)}
      ${this.renderUserCompanyDetails(userCompany)}
    </div>`;
  }

  renderUserBirthday(currentUser) {
    if (!currentUser.birthday) return '';
    return `<p>Birthday: ${getUserBirthday(currentUser.birthday)}</p>`;
  }

  renderUserAvatar(currentUser) {
    if (!currentUser.avatar) return '';
    return `<p><img src="${currentUser.avatar}" width="100px"></p>`;
  }

  renderUserCompanyDetails(userCompany) {
    if (!userCompany) return '';
    return `
      <p>
        Company: <a href="${userCompany.url || ''}" target="_blank">${userCompany.title}</a>
      </p>
      <p>
        Industry: ${userCompany.industry}
      </p>`;
  }

  renderStatistics() {
    this.tableBody.insertAdjacentHTML('beforeend',
      `<tr>
        <td>Orders Count</td>
        <td colspan="6">11</td>
      </tr>
      <tr>
        <td>Orders Total</td>
        <td colspan="6">$ 6722.72</td>
      </tr>
      <tr>
        <td>Median Value</td>
        <td colspan="6">$ 593.72</td>
      </tr>
      <tr>
        <td>Average Check</td>
        <td colspan="6">$ 611.16</td>
      </tr>
      <tr>
        <td>Average Check (Female)</td>
        <td colspan="6">$ 395.18</td>
      </tr>
      <tr>
        <td>Average Check (Male)</td>
        <td colspan="6">$ 692.15</td>
      </tr>`
    );
  }
}

export default new View();