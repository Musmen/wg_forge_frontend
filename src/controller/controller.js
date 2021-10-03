import { CLASS_NAMES } from '../common/constants';

class Controller {
  model = null;
  view = null;

  init(model, view) {
    this.beforeUnloadHandlerBinded = this.beforeUnloadHandler.bind(this);
    this.userLinkOnClickHandlerBinded = this.userLinkOnClickHandler.bind(this);

    this.model = model;
    
    this.view = view;
    this.view.init();

    this.renderFullTable();
    this.view.addUserLinkOnClickHandler(this.userLinkOnClickHandlerBinded);

    window.addEventListener('beforeunload', this.beforeUnloadHandlerBinded);
  }

  async renderFullTable() {
    await this.fetchFullData();
    this.renderOrders();
  }

  fetchFullData() {
    return Promise.all([
      this.model.getOrders(),
      this.model.getUsers(),
      this.model.getCompanies(),
    ]);
  }

  userLinkOnClickHandler(event) {
    if (!event.target.closest(`.${CLASS_NAMES.USER_LINK}`)) return;
    event.preventDefault();
    
    const userDetailsBlock = event.target.parentElement.querySelector(`.${CLASS_NAMES.USER_DETAILS}`);
    userDetailsBlock.classList.toggle(CLASS_NAMES.HIDE);
  }
  
  renderOrders() {
    this.view.renderOrders(this.model.orders, this.model.users, this.model.companies);
  }

  beforeUnloadHandler() {
    this.view.removeAllHandlers();
    window.removeEventListener('beforeunload', this.beforeUnloadHandlerBinded);
  }
}

export default new Controller();