import ReVueComponent from '../../../ReVue/ReVueComponent.js';
import {prepareChildrens} from './Table__Childrens.js';

class Table extends ReVueComponent{
  constructor(props){
    super(props);

    this.tagName = 'div';
    this.attributes = {
      classNames: 'tasks-table'
    };

    this.childrens = prepareChildrens(props);
    this.setChildrens().buildElement();
  }
}

export default Table;