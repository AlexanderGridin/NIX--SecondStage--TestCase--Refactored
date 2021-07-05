import TableItemEntity from './TableItemEntity.js';

/**
 * Костя, в этом и других классах я использовал много деструктуризации.
 * Основная идея - наглядное представление всех свойств класса и параметров конструктора.
 * Очень интересно было бы узнать, применяется ли такой подход на реальных проектах + узнать свои ошибки при применении данного подхода, т.к. подозреваю, что местами она избыточна, но на дополнительный рефакторинг времени у меня не осталось :(
 * ...Гридин.
 */

/**
 * Также, не успел нормально упорядочить методы...
 * ...Гридин.
 */
export default class TableCell extends TableItemEntity{
  constructor({column, value, templates}){
    super(column);

    this.value = value;

    if(templates){
      let {
        bodyCellInnerTemplate,
      } = templates;

      this.templates = {
        bodyCellInnerTemplate,
      }
    }

    this.element = null;
    this.sortingButton = null;
  }

  createElement({tableTagName, rowParentElement}){
    if(tableTagName === 'div'){
      this.element = document.createElement(tableTagName);
    }

    if(
      tableTagName === 'table' && 
      rowParentElement !== 'header'
    ){
      this.element = document.createElement('td');
    }

    if(
      tableTagName === 'table' && 
      rowParentElement === 'header'
    ){
      this.element = document.createElement('th');
    }

    return this;
  }

  addClassNames(classNames){
    this.element.classList.add(classNames);
    return this;
  }

  build({rowParentElement}){
    if(rowParentElement === 'header'){
      this._buildHeaderCell();
    }

    if(rowParentElement === 'body'){
      this._callCellHandlers();
      this._buildBodyCell();
    }

    if(rowParentElement === 'summary'){
      this._buildSummaryCell();
    }
  }

  _buildHeaderCell(){
    if(!this.sorter){
      this.element.innerHTML = this.title;
    }

    if(this.sorter){
      let sortingButton = document.createElement('button');
      sortingButton.setAttribute('type', 'button');
      sortingButton.setAttribute('data-sorting-column-name', this.name);
      sortingButton.setAttribute('data-sorting-type', this.sorter.type);
      sortingButton.setAttribute('data-sorting-direction', 'ASC');
      sortingButton.classList.add(this.sorter.className);
      sortingButton.innerHTML = `${this.title}${this.sorter.icon}`;

      this.sortingButton = sortingButton;
      this.element.append(sortingButton);
    }
    
    return this;
  }

  _buildBodyCell(){
    let cellInnerTpl = '';

    if(this.templates && this.templates.bodyCellInnerTemplate){
      cellInnerTpl = this.templates.bodyCellInnerTemplate;

      for(let prop in this){
        cellInnerTpl = cellInnerTpl.replace(`@${prop}`, this[prop]);
      }
    }

    if(!this.templates){
      cellInnerTpl = this.value;
    }

    this.element.innerHTML = cellInnerTpl;
    return this;
  }

  _buildSummaryCell(){
    if(this.summary){
      this.element.innerHTML = this.value;
    }
  }

  _callCellHandlers(){
    if(this.handlers && this.handlers.length > 0){
      for(let handler of this.handlers){
        handler.call(this);
      }
    }
  }
}