import ReVueComponent from '../../../ReVue/ReVueComponent.js';

class TableCellContent extends ReVueComponent{
  constructor(props){
    super(props);

    this.tagName = 'div';
    this.attributes = {
      classNames: 'tasks-table__cell-content',
      innerHTML: props.content,
    };

    this.buildElement();
  }
}

export default TableCellContent;