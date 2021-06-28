import ReVueComponent from '../../../ReVue/ReVueComponent.js';
import {prepareChildrens} from './TableHeader__Childrens.js';

class TableHeader extends ReVueComponent{
  constructor(props){
    super(props);

    this.tagName = 'div';
    this.attributes = {
      classNames: 'tasks-table__header',
    };

    this.childrens = prepareChildrens(props);
    this.setChildrens().buildElement();
  }
}

export default TableHeader;