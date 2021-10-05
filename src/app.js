import 'bootstrap';
import './styles.scss';

import 'regenerator-runtime/runtime';

import model from './app/model/model';
import view from './app/view/view';
import controller from './app/controller/controller';

export default (function () {
  window.onload = () => { controller.init(model, view); }
}());
