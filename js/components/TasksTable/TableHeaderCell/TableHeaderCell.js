import ReVueComponent from '../../../ReVue/ReVueComponent.js';
import {prepareChildrens} from './TableHeaderCell__Childrens.js';

class TableHeaderCell extends ReVueComponent{
  constructor(props){
    super(props);

    this.tagName = 'div';
    this.attributes = {
      classNames: 'tasks-table__header-cell',
    };

    this.childrens = prepareChildrens(props);
    this.setChildrens().buildElement();
  }
}

export default TableHeaderCell;