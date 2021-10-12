import 'bootstrap';
import './styles.scss';

import 'regenerator-runtime/runtime';

import model from './app/model/model';
import view from './app/view/view';
import controller from './app/controller/controller';

export default (function app() {
  window.onload = async () => {
    await model.init();
    view.init();
    controller.init(model, view);
  };
}());
