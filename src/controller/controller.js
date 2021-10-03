class Controller {
  model = null;
  view = null;

  init(model, view) {
    this.model = model;
    
    this.view = view;
    this.view.init();

    this.addOrders();
  }

  async addOrders() {
    const orders = await this.model.getOrders();
    debugger;
    this.view.renderOrders(orders);
  }
}

export default new Controller();