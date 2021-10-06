import { CLASS_NAMES, FEMALE_GENDER } from '../common/constants';
import { 
  getAverage,
  getCompareFunction, getCurrentUserById, getMedian,
  getOrders, getOrdersTotal, getUserCompanyById,
} from '../common/helpers';

class Controller {
  model = null;
  view = null;

  sortState = null;

  ordersForView = null;

  async init(model, view) {
    this.model = model;
    await this.model.init();
    
    this.view = view;
    this.view.init();
    
    this.beforeUnloadHandlerBinded = this.beforeUnloadHandler.bind(this);
    this.userLinkOnClickHandlerBinded = this.userLinkOnClickHandler.bind(this);
    this.tableHeadOnClickHandlerBinded = this.tableHeadOnClickHandler.bind(this);
    
    this.ordersForView = this.getOrdersForView();
    this.addOrdersTable();
    
    window.addEventListener('beforeunload', this.beforeUnloadHandlerBinded);
  }
  
  addOrdersTable() {
    this.renderOrders(this.sortOrdersForView(this.ordersForView));
    this.renderStatistics(this.getStatistics(this.ordersForView));

    this.view.addUserLinkOnClickHandler(this.userLinkOnClickHandlerBinded);
    this.view.addTableHeadkOnClickHandler(this.tableHeadOnClickHandlerBinded);
  }

  getOrdersForView() {
    return this.model.orders.map(
      order => {
        const currentUser = getCurrentUserById(this.model.users, order.user_id);
        const userCompany = getUserCompanyById(this.model.companies, currentUser.company_id);
        return { order, currentUser, userCompany };
      }
    );
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
    const clickedTableHeadCellWithSortingOption = event.target.closest(`[data-sort-by-properties]`);

    if (!clickedTableHeadCellWithSortingOption) return;

    const newSortState = { 
      ...clickedTableHeadCellWithSortingOption.dataset,
      sortByProperties: clickedTableHeadCellWithSortingOption.dataset.sortByProperties.split(','), 
    }
    
    if (JSON.stringify(newSortState) === JSON.stringify(this.sortState)) return;
    this.sortState = newSortState;

    this.view.addSortedMark(clickedTableHeadCellWithSortingOption);
    this.view.clearOrdersTable();
    this.addOrdersTable();
  }

  getStatistics(ordersForView) {
    const orders = getOrders(ordersForView);
    const ordersCount = orders.length;
    const ordersTotal = getOrdersTotal(orders);
    const median = getMedian(orders.map(order => +order.total));
    const averageCheck = getAverage(ordersTotal, ordersCount);

    const ordersForViewFemale =  ordersForView.filter(
      orderForView => orderForView.currentUser.gender === FEMALE_GENDER
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

export default new Controller();