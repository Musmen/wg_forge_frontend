import 'bootstrap';
import './styles.scss';

import 'regenerator-runtime/runtime';

import model from './app/model/model';
import view from './app/view/view';
import controller from './app/controller/controller';

const appInit = async () => {
  await model.init();
  view.init();
  controller.init(model, view);

  document.removeEventListener('DOMContentLoaded', appInit);
};

export default (function app() {
  document.addEventListener('DOMContentLoaded', appInit);
}());
