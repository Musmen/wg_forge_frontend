import { CURRENCIES_SYMBOLS } from '../common/currencies';
import { 
  CLASS_NAMES, DEFAULT_CURRENCY, EMPTY_AMOUNT_TO_PRINT, SORTED_LABEL 
} from '../common/constants';
import { 
  getCardNumberMask, getOrderTime, getUserFullName, getUserPrefix, getUserBirthday,
} from '../common/helpers';

class View {
  listenersList = []

  elements = {
    table: {
      main: null,
      body: null,
      head: null,
    },
    sortedMark: null,
    searchInput: null,
    currencySelect: null,
  };
  
  printAmount = null;

  init() {
    this.elements.table.main = document.querySelector(`.${CLASS_NAMES.TABLE.MAIN}`);
    this.elements.table.body = this.elements.table.main.querySelector(`.${CLASS_NAMES.TABLE.BODY}`);
    this.elements.table.head = this.elements.table.main.querySelector(`.${CLASS_NAMES.TABLE.HEAD}`);

    this.elements.sortedMark = document.createElement('span');
    this.elements.sortedMark.innerHTML = SORTED_LABEL;

    this.elements.searchInput = this.elements.table.main.querySelector(`.${CLASS_NAMES.SEARCH_INPUT}`);
    
    this.elements.currencySelect = this.elements.table.main.querySelector(`.${CLASS_NAMES.CURRENCY_SELECT}`);
  }

  removeAllHandlers() {
    this.listenersList.forEach((listener) => {
      listener.element.removeEventListener(listener.event, listener.handler);
    });
  }

  clearOrdersTable() {
    this.elements.table.body.innerHTML = '';
  }

  addUserLinkOnClickHandler(userLinkOnClickHandler) {
    this.elements.table.body.addEventListener('click', userLinkOnClickHandler);
    this.listenersList.push({ 
      element: this.elements.table.body, 
      event: 'click', 
      handler: userLinkOnClickHandler,
    });
  }

  addTableHeadkOnClickHandler(tableHeadOnClickHandler) {
    this.elements.table.head.addEventListener('click', tableHeadOnClickHandler);
    this.listenersList.push({ 
      element: this.elements.table.head, 
      event: 'click', 
      handler: tableHeadOnClickHandler, 
    });
  }

  addSearchInputChangeHandler(searchInputChangeHandler) {
    this.elements.searchInput.addEventListener('input', searchInputChangeHandler);
    this.listenersList.push({
      element: this.elements.searchInput, 
      event: 'input', 
      handler: searchInputChangeHandler,
    });
  }

  addCurrencySelectChangeHandler(currencySelectChangeHandler) {
    this.elements.currencySelect.addEventListener('change', currencySelectChangeHandler);
    this.listenersList.push({
      element: this.elements.currencySelect, 
      event: 'change', 
      handler: currencySelectChangeHandler,
    });
  }

  addSortedMark(element) {
    element.insertAdjacentElement('beforeend', this.elements.sortedMark);
  }

  renderOrders(ordersForView) {
    if (!ordersForView.length) {
      this.elements.table.body.insertAdjacentHTML('beforeend',
        `<tr>
          <td colspan="7">Nothing found</td>
        </tr>`
      );
      return;
    }

    const ordersFragment = new DocumentFragment();

    ordersForView.forEach(
      ({ order, currentUser, userCompany }) => {
        ordersFragment.append(
          this.renderOrderTableRow(order, currentUser, userCompany)
        )
      }
    );
    
    this.elements.table.body.append(ordersFragment);
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
        ${this.printAmount(order.total)}
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
    return `<a class="user-link btn btn-primary" href="#">
      ${getUserPrefix(currentUser)} ${getUserFullName(currentUser)}
    </a>`
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
    return `<p><img src="${currentUser.avatar}" width="100px" alt="user avatar"></p>`;
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

  renderStatistics({ 
    ordersCount, ordersTotal, median, averageCheck, averageCheckFemale, averageCheckMale, 
  }) {
    this.elements.table.body.insertAdjacentHTML('beforeend',
      `<tr class="table-dark statistic-row">
        <td>Orders Count</td>
        <td colspan="6">${ordersCount || EMPTY_AMOUNT_TO_PRINT}</td>
      </tr>
      <tr class="table-dark statistic-row">
        <td>Orders Total</td>
        <td colspan="6">${this.printAmount(ordersTotal)}</td>
      </tr>
      <tr class="table-dark statistic-row">
        <td>Median Value</td>
        <td colspan="6">${this.printAmount(median)}</td>
      </tr>
      <tr class="table-dark statistic-row">
        <td>Average Check</td>
        <td colspan="6">${this.printAmount(averageCheck)}</td>
      </tr>
      <tr class="table-dark statistic-row">
        <td>Average Check (Female)</td>
        <td colspan="6">${this.printAmount(averageCheckFemale)}</td>
      </tr>
      <tr class="table-dark statistic-row">
        <td>Average Check (Male)</td>
        <td colspan="6">${this.printAmount(averageCheckMale)}</td>
      </tr>`
    );
  }
  
  renderCurrencySelect(currencySymbols) {
    const currencyOptionsFragment = new DocumentFragment();

    Object.entries(currencySymbols).forEach(
      ([currencySymbol, currencySymbolDescription]) => {
        currencyOptionsFragment.append(
          this.renderCurrencyOption(currencySymbol, currencySymbolDescription)
        )
      }
    );
    
    this.elements.currencySelect.append(currencyOptionsFragment);
  }

  renderCurrencyOption(currencySymbol, currencySymbolDescription) {
    const currencyOption = document.createElement('option');
    if (currencySymbol === DEFAULT_CURRENCY) currencyOption.selected = true;
    currencyOption.value = currencySymbol;
    currencyOption.textContent = `${currencySymbolDescription} ${CURRENCIES_SYMBOLS[currencySymbol] || ''}`;
    return currencyOption;
  }
}

export default new View();