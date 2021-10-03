import { 
  getCardNumberMask, getUserCompanyById, getCurrentUserById,
  getOrderTime, getUserFullName, getUserPrefix, getUserBirthday,
} from '../common/helpers';

class View {
  listenersList = []

  table = null;
  tableBody = null;

  init() {
    this.table = document.querySelector('.table');
    this.tableBody = document.querySelector('.table-body');
  }

  removeAllHandlers() {
    this.listenersList.forEach((listener) => {
      this.table.removeEventListener(listener.event, listener.handler);
    });
  }

  addUserLinkOnClickHandler(userLinkOnClickHandler) {
    this.tableBody.addEventListener('click', userLinkOnClickHandler);
    this.listenersList.push({event: 'click', handler: userLinkOnClickHandler});
  }

  renderOrders(orders, users, companies) {
    const ordersFragment = new DocumentFragment();
    orders.forEach(
      order => {
        const currentUser = getCurrentUserById(users, order.user_id);
        const userCompany = getUserCompanyById(companies, currentUser.company_id);
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
      <td>`
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
    if (currentUser.birthday) {
      return `<p>Birthday: ${getUserBirthday(currentUser.birthday)}</p>`;
    }
    return '';
  }

  renderUserAvatar(currentUser) {
    if (currentUser.avatar) {
      return `<p><img src="${currentUser.avatar}" width="100px"></p>`;
    }
    return '';
  }

  renderUserCompanyDetails(userCompany) {
    if (userCompany) {
      return `
        <p>
          Company: <a href="${userCompany.url || ''}" target="_blank">${userCompany.title}</a>
        </p>
        <p>
          Industry: ${userCompany.industry}
        </p>`;
    }
    return '';
  }
}

export default new View();