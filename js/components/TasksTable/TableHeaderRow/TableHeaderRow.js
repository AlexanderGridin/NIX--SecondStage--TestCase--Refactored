import ReVueComponent from '../../../ReVue/ReVueComponent.js';
import {prepareChildrens} from './TableHeaderRow__Childrens.js';

class TableHeaderRow extends ReVueComponent{
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

export default TableHeaderRow;