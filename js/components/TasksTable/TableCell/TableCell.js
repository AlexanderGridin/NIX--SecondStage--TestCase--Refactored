import ReVueComponent from '../../../ReVue/ReVueComponent.js';
import {prepareChildrens} from './TableCell__Childrens.js';

class TableCell extends ReVueComponent{
  constructor(props){
    super(props);

    this.tagName = 'div';
    this.attributes = {
      classNames: 'tasks-table__cell',
    };

    this.childrens = prepareChildrens(props);
    this.setChildrens().buildElement();
  }
}

export default TableCell;