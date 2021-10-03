class Controller {
  model = null;
  view = null;

  init(model, view) {
    this.model = model;
    
    this.view = view;
    this.view.init();

    this.renderFullTable();
  }

  async renderFullTable() {
    await this.fetchFullData();
    this.renderOrders();
  }

  fetchFullData() {
    return Promise.all([
      this.model.getOrders(),
      this.model.getUsers(),
    ]);
  }
  
  renderOrders() {
    this.view.renderOrders(this.model.orders, this.model.users);
  }
}

export default new Controller();