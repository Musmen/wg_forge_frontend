import 'regenerator-runtime/runtime';

import model from './model/model';
import view from './view/view';
import controller from './controller/controller';

export default (async function () {
    window.onload = () => {  
        controller.init(model, view);
    }
}());
