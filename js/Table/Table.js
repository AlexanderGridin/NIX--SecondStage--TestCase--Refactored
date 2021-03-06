import TableColumn from './TableColumn.js';
import TableRow from './TableRow.js';
import TableCell from './TableCell.js';
import {utils} from './utils.js';

/**
 * Костя, в этом и других классах использовано много деструктуризации.
 * Основная идея - наглядное представление всех свойств класса и параметров конструктора.
 * Очень интересно было бы узнать, применяется ли такой подход на реальных проектах + узнать свои ошибки при применении данного подхода, т.к. подозреваем, что местами она избыточна, но на дополнительный рефакторинг времени не осталось :(
 */

/**
 * Также, не успели нормально упорядочить методы...
 */
class Table{
  constructor(wrapperSelector, {
    tagName,
    classNames,

    header,
    summary,
    footer,

    columns,
    bodyCellInnerTemplate,

  }){
    this.tagName = tagName;
    this.wrapperElement = document.querySelector(wrapperSelector);

    if(classNames){
      let {
        body: bodyClassName,
        row: rowClassName,
        cell: cellClassName,
      } = classNames;

      this.classNames = {
        body: bodyClassName,
        row: rowClassName,
        cell: cellClassName,
      };
    }

    if(header){
      let {
        create: isHeaderCreate,
        className: headerClassName,
      } = header;

      this.header = {
        create: isHeaderCreate,
        className: headerClassName,
        element: null,
        row: null,
      };
    }
    
    this.body = {
      className: this.classNames.body,
      element: null,
      rows: [],
    };

    if(summary){
      let {
        create: isSummaryCreate,
        className: summaryClassName,
        title: summaryTitle,
      } = summary;

      this.summary = {
        create: isSummaryCreate,
        className: summaryClassName,
        title: summaryTitle,
        element: null,
        row: null,
      };
    }
    
    if(footer){
      let {
        create: isFooterCreate,
        className: footerClassName,
      } = footer;

      this.footer = {
        create: isFooterCreate,
        className: footerClassName,
        element: null,
      };
    }
    

    this.columns = [];
    for(let column of columns){
      this.columns.push(new TableColumn(column));
    }

    this.bodyCellInnerTemplate = bodyCellInnerTemplate;
    this.sortingButtons = [];
    this.fieldsForSummary = [];
    this.data = null;

    this._initElements();
  }

  _initElements(){
    if(this.header.create && this.tagName === 'div'){
      this.header.element = document.createElement(this.tagName);
      this.header.element.classList.add(this.header.className);
    }

    if(this.tagName === 'div'){
      this.body.element = document.createElement(this.tagName);
    }

    if(this.tagName === 'table'){
      this.body.element = document.createElement('tbody');
    }

    this.body.element.classList.add(this.body.className);

    if(this.summary.create && this.tagName === 'div'){
      this.summary.element = document.createElement(this.tagName);
      this.summary.element.classList.add(this.summary.className);
    }

    if(this.footer.create && this.tagName === 'div'){
      this.footer.element = document.createElement(this.tagName);
      this.footer.element.classList.add(this.footer.className);
    }

    return this;
  }

  build(data){
    this.data = data;

    this._render(data);
    this._handleSortingButtons();

    return this;
  }

  _render(data){
    if(this.header.create){
      this._buildHeader(data);
      this.wrapperElement.append(this.header.element);
    }
    
    this._buildBody(data);
    this.wrapperElement.append(this.body.element);

    if(this.summary.create){
      this._buildSummary(data);
      this.wrapperElement.append(this.summary.element);
    }
    
    if(this.footer.create){
      this.wrapperElement.append(this.footer.element);
    }

    return this;
  }

  _handleSortingButtons(){
    let headerCells = this.header.row.cells;

    for(let cell of headerCells){
      if(!cell.sortingButton){
        continue;
      }

      let button = cell.sortingButton;
      let table = this;

      button.addEventListener('click', function(e){
        e.preventDefault();
        e.stopPropagation();

        let sortingColumnName = button.getAttribute('data-sorting-column-name');
        let sortingDirection = button.getAttribute('data-sorting-direction');
        let sortedData = table._sortTableDataByColumnName(sortingColumnName, sortingDirection);

        table.updateBody(sortedData)
          ._changeSortingButtonSortingDirection(button);

        utils.removeClassFromElements(table.sortingButtons, 'sorted')
        button.classList.add('sorted');
      });
    }
  }

  _buildHeader(data){
    let dataItem = data[0];
    let row = this._createRow(dataItem, 'header');

    this.header.row = row;
    this.header.element.append(row.element);
    return this.header.element;
  }

  _buildBody(data){
    for(let dataRow of data){
      let row = this._createRow(dataRow, 'body');

      this.body.rows.push(row);
      this.body.element.append(row.element);
    }

    return this.body.element;
  }

  _buildSummary(data){
    let dataItem = data[0];
    let summaryItems = this._createSummaryItemsFromColumns(this.columns);
    let row = this._createRow(dataItem, 'summary');

    for(let cell of row.cells){
      if(cell.summary){
        let summaryItem = summaryItems.find((item) => {
          return item.name === cell.name;
        });

        if(summaryItem){
          cell.element.innerHTML = summaryItem.value;
        }
      }

      if(!cell.summary){
        cell.element.innerHTML = '&nbsp;';
      }
    }

    row.cells[0].element.innerHTML = this.summary.title;

    this.summary.row = row;
    this.summary.element.append(row.element);
    return this.summary.element;
  }

  _createSummaryItemsFromColumns(columns){
    let summaryItems = [];

    for(let column of columns){
      if(column.summary){
        let summaryDataItem = {};

        summaryDataItem.name = column.name;
        summaryDataItem.value = this.data.reduce((prev, item) => {
          return prev + +item[column.name];
        }, 0);

        summaryItems.push(summaryDataItem);
      }
    }

    return summaryItems;
  }

  updateBody(data){
    this._clearBody()
      ._clearData()
      ._updateData(data)
      ._buildBody(data);

    if(this.summary.element){
      this.summary.element.before(this.body.element);
    }

    if(!this.summary.element){
      this.wrapperElement.append(this.body.element);
    }

    return this;
  }

  _clear(){
    this._clearBody()
      ._clearData();

    return this;
  }

  _clearBody(){
    let rows = this.body.rows;

    for(let row of rows){
      row.element.remove();
    }

    this.body.rows.length = 0;
    return this;
  }

  updateSummary(data){
    this._clearSummary();

    this.summary.element = document.createElement(this.tagName);
    this.summary.element.classList.add(this.summary.className);

    this._buildSummary(data);

    this.body.element.after(this.summary.element);

    return this;
  }

  _clearSummary(){
    if(this.summary.create){
      this.summary.element.remove();
      this.summary.element = null;
      this.row = null;
    }

    return this;
  }

  _clearData(){
    this.data = null;
    return this;
  }

  _updateData(data){
    this.data = data;
    return this;
  }

  // supported parentElement values: header, body, summary
  _createRow(dataItem, parentElement){
    let row = new TableRow({
      tableTagName: this.tagName,
      data: dataItem,
    })
      .addClassName(this.classNames.row);

    let cells = this._createCellsFromDataRowAndColumns(dataItem, this.columns);

    for(let cell of cells){
      cell.createElement({
        tableTagName: this.tagName,
        rowParentElement: parentElement,
      })
        .addClassNames(this.classNames.cell)
        .build({
          rowParentElement: parentElement
        });

      row.addCell(cell);

      if(parentElement === 'header' && cell.sortingButton){
        this.sortingButtons.push(cell.sortingButton);
      }
    }

    row.build();
    return row;
  }

  _createCellsFromDataRowAndColumns(dataRow, columns){
    if(!columns){
      return dataRow;
    }

    let rowCells = [];

    for(let col of columns){
      let cell = new TableCell({
        column: col,
        value: dataRow[col.name],
        templates: {
          bodyCellInnerTemplate: this.bodyCellInnerTemplate,
        },
      });

      rowCells.push(cell);
    }

    return rowCells;
  }

  _sortTableDataByColumnName(columnName, sortDirection){
    let sortedData = null;
    sortDirection = sortDirection.toLowerCase();

    // TODO: это очень плохой кусок кода...его нужно отрефакторить
    if(columnName.toLowerCase() === 'efficiency'){
      switch(sortDirection){
        case 'asc':
          sortedData = this.data.sort((a, b) => {
            a = a[columnName].match(/\d/g);
            b = b[columnName].match(/\d/g);

            if(a === null){
              a = 0;
            } else {
              a = +a.join('');
            }

            if(b === null){
              b = 0;
            } else {
              b = +b.join('');
            }

            return a - b;
          });
          break;

        case 'desc':
          sortedData = this.data.sort((a, b) => {
            a = a[columnName].match(/\d/g);
            b = b[columnName].match(/\d/g);

            if(a === null){
              a = 0;
            } else {
              a = +a.join('');
            }

            if(b === null){
              b = 0;
            } else {
              b = +b.join('');
            }
            
            return b - a;
          });
          break;
      }

      return sortedData;
    }

    switch(sortDirection){
      case 'asc':
        sortedData = this.data.sort((a, b) => {
          return +a[columnName] - +b[columnName];
        });
        break;

      case 'desc':
        sortedData = this.data.sort((a, b) => {
          return +b[columnName] - +a[columnName];
        });
        break;
    }

    return sortedData;
  }

  _changeSortingButtonSortingDirection(button){
    let sortingDirection = button.getAttribute('data-sorting-direction');

    switch(sortingDirection.toLowerCase()){
      case 'asc':
        button.setAttribute('data-sorting-direction', 'DESC');
        break;

      case 'desc':
        button.setAttribute('data-sorting-direction', 'ASC');
        break;
    }

    return this;
  }
}

export default Table;