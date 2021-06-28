import ReVueComponent from '../../../ReVue/ReVueComponent.js';
import {prepareChildrens} from './TableRow__Childrens.js';

class TableRow extends ReVueComponent{
  constructor(props){
    super(props);

    this.tagName = 'div';
    this.attributes = {
      classNames: 'tasks-table__row',
    };

    this.childrens = prepareChildrens(props);
    this.setChildrens().buildElement();
  }
}

export default TableRow;