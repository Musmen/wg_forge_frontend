import {
  CLASS_NAMES, DEFAULT_CURRENCY, DEFAULT_CURRENCY_RATIO, FEMALE_GENDER,
} from '../common/constants';
import {
  getAverage, getCompareFunction, getMedian,
  getOrders, getOrdersTotal, printAmountFactory,
} from '../common/helpers';

class Controller {
  constructor() {
    this.model = null;
    this.view = null;

    this.sortState = null;

    this.ordersForView = null;

    this.baseUSDRatio = null;
    this.currentCurrency = DEFAULT_CURRENCY;

    this.beforeUnloadHandlerBinded = this.beforeUnloadHandler.bind(this);
    this.userLinkOnClickHandlerBinded = this.userLinkOnClickHandler.bind(this);
    this.tableHeadOnClickHandlerBinded = this.tableHeadOnClickHandler.bind(this);
    this.searchInputChangeHandlerBinded = this.searchInputChangeHandler.bind(this);
    this.currencySelectChangeHandlerBinded = this.currencySelectChangeHandler.bind(this);
  }

  init(model, view) {
    this.model = model;
    this.ordersForView = this.model.getOrdersForView();
    this.baseUSDRatio = this.model.currencyRates[DEFAULT_CURRENCY];

    this.view = view;
    this.setPrintAmount();

    this.view.renderCurrencySelect(this.model.currencySymbols);
    this.view.addCurrencySelectChangeHandler(this.currencySelectChangeHandlerBinded);

    this.view.addSearchInputChangeHandler(this.searchInputChangeHandlerBinded);
    this.view.addUserLinkOnClickHandler(this.userLinkOnClickHandlerBinded);
    this.view.addTableHeadkOnClickHandler(this.tableHeadOnClickHandlerBinded);
    this.addOrdersTable(this.ordersForView);

    window.addEventListener('beforeunload', this.beforeUnloadHandlerBinded);
  }

  addOrdersTable(ordersForView) {
    this.renderOrders(this.sortOrdersForView(ordersForView));
    this.renderStatistics(this.getStatistics(ordersForView));
  }

  updateOrdersTable(ordersForView) {
    this.view.clearOrdersTable();
    this.addOrdersTable(ordersForView);
  }

  sortOrdersForView(ordersForView) {
    if (!this.sortState) return ordersForView;

    const compareFunction = getCompareFunction(this.sortState);
    return ordersForView.sort(compareFunction);
  }

  renderOrders(ordersForView) {
    this.view.renderOrders(ordersForView);
  }

  renderStatistics(statistics) {
    this.view.renderStatistics(statistics);
  }

  userLinkOnClickHandler(event) {
    const clickedUserLink = event.target.closest(`.${CLASS_NAMES.USER.LINK}`);
    if (!clickedUserLink) return;
    event.preventDefault();

    const userDetailsBlock = clickedUserLink.parentElement.querySelector(`.${CLASS_NAMES.USER.DETAILS}`);
    userDetailsBlock.classList.toggle(CLASS_NAMES.HIDE);
  }

  tableHeadOnClickHandler(event) {
    const clickedTableHeadCellWithSortingOption = event.target.closest('[data-sort-by-properties]');

    if (!clickedTableHeadCellWithSortingOption) return;

    const newSortState = {
      ...clickedTableHeadCellWithSortingOption.dataset,
      sortByProperties: clickedTableHeadCellWithSortingOption.dataset.sortByProperties.split(','),
    };

    if (JSON.stringify(newSortState) === JSON.stringify(this.sortState)) return;
    this.sortState = newSortState;

    this.view.addSortedMark(clickedTableHeadCellWithSortingOption);
    this.updateOrdersTable(this.ordersForView);
  }

  searchInputChangeHandler(event) {
    const searchedValue = event.target.value;
    this.ordersForView = this.model.getOrdersForView()
      .filter(
        ({ order, currentUser }) => [
          String(order.id), order.transaction_id, String(order.user_id),
          order.total, order.card_type, order.order_country, order.order_ip,
          currentUser.first_name, currentUser.last_name,
        ]
          .some(
            (searchedProperty) => searchedProperty.includes(searchedValue),
          ),
      );
    this.updateOrdersTable(this.ordersForView);
  }

  currencySelectChangeHandler({ target }) {
    if (this.currentCurrency === target.value) return;

    this.currentCurrency = target.value;
    this.setPrintAmount(
      this.currentCurrency,
      this.model.currencyRates[this.currentCurrency] / this.baseUSDRatio,
    );
    this.updateOrdersTable(this.ordersForView);
  }

  setPrintAmount(
    currentCurrency = DEFAULT_CURRENCY,
    currentCurrencyRatio = DEFAULT_CURRENCY_RATIO,
  ) {
    this.view.printAmount = printAmountFactory(currentCurrency, currentCurrencyRatio);
  }

  getStatistics(ordersForView) {
    const orders = getOrders(ordersForView);
    const ordersCount = orders.length;
    const ordersTotal = getOrdersTotal(orders);
    const median = getMedian(orders.map((order) => +order.total));
    const averageCheck = getAverage(ordersTotal, ordersCount);

    const ordersForViewFemale = ordersForView.filter(
      (orderForView) => orderForView.currentUser.gender === FEMALE_GENDER,
    );
    const ordersFemale = getOrders(ordersForViewFemale);
    const ordersCountFemale = ordersFemale.length;
    const ordersTotalFemale = getOrdersTotal(ordersFemale);
    const averageCheckFemale = getAverage(ordersTotalFemale, ordersCountFemale);

    const ordersCountMale = ordersCount - ordersCountFemale;
    const ordersTotalMale = ordersTotal - ordersTotalFemale;
    const averageCheckMale = getAverage(ordersTotalMale, ordersCountMale);

    return {
      ordersCount, ordersTotal, median, averageCheck, averageCheckFemale, averageCheckMale,
    };
  }

  beforeUnloadHandler() {
    this.view.removeAllHandlers();
    window.removeEventListener('beforeunload', this.beforeUnloadHandlerBinded);
  }
}

const controller = new Controller();
export default controller;
