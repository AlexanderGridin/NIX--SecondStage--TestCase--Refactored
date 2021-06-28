import ReVueComponent from '../../../ReVue/ReVueComponent.js';

class TableCellLabel extends ReVueComponent{
  constructor(props){
    super(props);

    this.tagName = 'div';
    this.attributes = {
      classNames: 'tasks-table__cell-label',
      textContent: props.label,
    };

    this.buildElement();
  }
}

export default TableCellLabel;