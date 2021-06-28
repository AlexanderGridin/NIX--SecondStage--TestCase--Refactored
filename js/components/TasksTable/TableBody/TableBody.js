import ReVueComponent from '../../../ReVue/ReVueComponent.js';
import {prepareChildrens} from './TableBody__Childrens.js';

class TableBody extends ReVueComponent{
  constructor(props){
    super(props);

    this.tagName = 'div';
    this.attributes = {
      classNames: 'tasks-table__body',
    };
    
    this.childrens = prepareChildrens(props);
    this.setChildrens().buildElement();
  }
}

export default TableBody;