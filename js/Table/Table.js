import {removeClassFromElements} from '../utils.js';

class Table{
  constructor(wrapperSelector, {
    tagName,
    classNames: {
      body: bodyClassName,
      row: rowClassName,
      cell: cellClassName,
    },

    header: {
      create: isHeaderCreate,
      className: headerClassName,
    },
    summary: {
      create: isSummaryCreate,
      className: summaryClassName,
      title: summaryTitle,
    },
    footer: {
      create: isFooterCreate,
      className: footerClassName,
    },

    columns,
    bodyCellInnerTemplate,

  }){
    this.tagName = tagName;
    this.wrapperElement = document.querySelector(wrapperSelector);

    this.classNames = {
      body: bodyClassName,
      row: rowClassName,
      cell: cellClassName,
    };

    this.header = {
      create: isHeaderCreate,
      className: headerClassName,
    };
    this.body = {
      className: bodyClassName,
    };
    this.summary = {
      create: isSummaryCreate,
      className: summaryClassName,
      title: summaryTitle,
    };
    this.footer = {
      create: isFooterCreate,
      className: footerClassName,
    },

    this.columns = columns;
    this.bodyCellInnerTemplate = bodyCellInnerTemplate;

    this.sortingButtons = [];
    this.fieldsForSummary = [];
    this.data = null;

    // this.tagName = props.tagName;
    // this.wrapperElement = document.querySelector(props.wrapper);

    // this.classNames = {
    //   body: props.classNames.body,
    //   row: props.classNames.row,
    //   cell: props.classNames.cell,
    // };

    // this.header = props.header;
    // this.body = {
    //   className: props.classNames.body,
    // };
    // this.summary = props.summary;
    // this.footer = props.footer;

    // this.columns = props.columns;
    // this.bodyCellInnerTemplate = props.bodyCellInnerTemplate;

    // this.sortingButtons = [];

    // this.fieldsForSummary = [];

    // this.data = null;

    this._init();
  }

  _init(){
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
    this._render(data);
    this._handleSortingButtons();

    return this;
  }

  _render(data){
    this.data = data;

    if(this.header.create){
      this._fillHeader(data);
      this.wrapperElement.append(this.header.element);
    }
    
    this._fillBody(data);
    this.wrapperElement.append(this.body.element);

    if(this.summary.create){
      this._fillSummary(data);
      this.wrapperElement.append(this.summary.element);
    }
    
    if(this.footer.create){
      this.wrapperElement.append(this.footer.element);
    }

    return this;
  }

  _handleSortingButtons(){
    if(this.sortingButtons.length === 0){
      return;
    }

    let self = this;

    for(let button of this.sortingButtons){
      button.addEventListener('click', function(e){
        e.preventDefault();
        e.stopPropagation();

        let sortingFieldName = button.getAttribute('data-sorting-column-name');
        let sortingDirection = button.getAttribute('data-sorting-direction');
        let sortedData = self.sortTableDataByField(sortingFieldName, sortingDirection);

        self.clearBody();
        self.updateBody(sortedData);

        changeButtonSortingDirection(button);
        removeClassFromElements(self.sortingButtons, 'sorted')
        button.classList.add('sorted');
      });
    }
  }

  _fillHeader(data){
    let dataItem = data[0];
    this.header.element.append(this._createRow(dataItem, 'header'));
    return this.header.element;
  }

  _fillBody(data){
    for(let dataRow of data){
      this.body.element.append(this._createRow(dataRow));
    }

    return this.body.element;
  }

  _fillSummary(data){
    let dataItem = data[0];
    this.summary.element.append(this._createRow(dataItem, 'summary'));
    return this.summary.element;
  }

  _createRow(dataRow, type = 'body'){
    let rowElement = this._createRowElement();
    rowElement.classList.add(this.classNames.row);

    let dataCells = this._fillDataCellsValues(dataRow, this.columns);
    let cellsElements = this._createCells(dataCells, type);

    for(let cell of cellsElements){
      rowElement.append(cell);
    }

    return rowElement;
  }

  _createRowElement(){
    let rowElement = null;

    if(this.tagName === 'div'){
      rowElement = document.createElement(this.tagName);
    }

    if(this.tagName === 'table'){
      rowElement = document.createElement('tr');
    }

    return rowElement;
  }

  _fillDataCellsValues(dataRow, columns = null){
    if(!columns){
      return dataRow;
    }

    let columnsWithValues = [];

    for(let col of columns){
      col.value = dataRow[col.name];
      columnsWithValues.push(col);
    }

    return columnsWithValues;
  }

  _createCells(dataCells, type){
    let cells = [];

    for(let cell of dataCells){
      let cellElement = this._createCellElement(cell);
      cellElement.classList.add(this.classNames.cell);

      if(type === 'header'){
        cells.push(this._fillHeaderCell(cell));
      }

      if(type === 'body'){
        this._callCellHandlers(cell);
        cells.push(this._fillBodyCell(cell));
      }

      if(type === 'summary'){
        cells.push(this._fillSummaryCell(cell));
      }
    }

    return cells;
  }

  _createCellElement(cell){
    if(this.tagName === 'div'){
      cell.element = document.createElement(this.tagName);
    }

    if(this.tagName === 'table' && !isHeaderCell){
      cell.element = document.createElement('td');
    }

    if(this.tagName === 'table' && isHeaderCell){
      cell.element = document.createElement('th');
    }

    return cell.element;
  }

  _callCellHandlers(cell){
    if(cell.handlers && cell.handlers.length > 0){
      for(let handler of cell.handlers){
        handler.call(cell);
      }
    }
  }

  _fillHeaderCell(column){
    if(!column.sorter){
      column.element.innerHTML = column.title;
    }

    if(column.sorter){
      let sortingButton = document.createElement('button');
      sortingButton.setAttribute('type', 'button');
      sortingButton.setAttribute('data-sorting-column-name', column.name);
      sortingButton.setAttribute('data-sorting-type', column.sorter.type);
      sortingButton.setAttribute('data-sorting-direction', 'ASC');
      sortingButton.classList.add(column.sorter.className);
      sortingButton.innerHTML = `${column.title}${column.sorter.icon}`;

      this.sortingButtons.push(sortingButton);
      column.element.append(sortingButton);
    }
    
    return column.element;
  }

  _fillBodyCell(column){
    let cellInnerTpl = '';

    if(this.bodyCellInnerTemplate){
      cellInnerTpl = this.bodyCellInnerTemplate;

      for(let prop in column){
        cellInnerTpl = cellInnerTpl.replace(`@${prop}`, column[prop]);
      }
    }

    if(!this.bodyCellInnerTemplate){
      cellInnerTpl = column.value;
    }

    column.element.innerHTML = cellInnerTpl;
    return column.element;
  }

  _fillSummaryCell(cell)
  {

  }

  // ! OLD CODE
  setFieldsForSummary(...fieldsNames){
    this.fieldsForSummary = fieldsNames;
    return this;
  }

  updateBody(data){
    let tableHeader = this.wrapperElement.querySelector('.tasks-table__header');

    this.clearBody();
    let newTableBody = this.createTableBody(data);

    if(tableHeader){
      tableHeader.after(newTableBody);
    }

    if(!tableHeader){
      this.wrapperElement.prepend(newTableBody);
    }

    this.data = data;

    return this;
  }

  clearBody(){
    let body = this.wrapperElement.querySelector('.tasks-table__body');

    if(body){
      body.remove();
    }

    this.data = null;

    return this;
  }

  // TODO
  sortTableDataByField(fieldName, sortDirection){
    let sortedData = null;
    sortDirection = sortDirection.toLowerCase();

    // TODO: это очень плохой кусок кода...его нужно отрефакторить
    if(fieldName.toLowerCase() === 'efficiency'){
      switch(sortDirection){
        case 'asc':
          sortedData = this.data.sort((a, b) => {
            a = a[fieldName].match(/\d/g);
            b = b[fieldName].match(/\d/g);

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
            a = a[fieldName].match(/\d/g);
            b = b[fieldName].match(/\d/g);

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
          return +a[fieldName] - +b[fieldName];
        });
        break;

      case 'desc':
        sortedData = this.data.sort((a, b) => {
          return +b[fieldName] - +a[fieldName];
        });
        break;
    }

    return sortedData;
  }

  // Table summary functions
  createTableSummary(data){
    let tableSummary = document.createElement('div');
    tableSummary.classList.add('tasks-table__summary');

    tableSummary.append(this.createTableSummaryRow(data));

    return tableSummary;
  }

  // TODO: этой функции жизненно необходим рефакторинг...
  createTableSummaryRow(data){
    let tableSummaryRow = document.createElement('div');
    tableSummaryRow.classList.add('tasks-table__row');

    let cells = [];
    let tableCellTemplate = '';

    let parsedData = [];
    let parsedDataItem = null;

    let summaryData = [];
    let fieldsForParsing = [
      {
        fieldName: 'taskName',
        fieldLabel: 'Task name',
      },
      {
        fieldName: 'developer',
        fieldLabel: 'Developer',
      },
      {
        fieldName: 'workType',
        fieldLabel: 'Work Type',
      },
      {
        fieldName: 'status',
        fieldLabel: 'Status',
      },
      {
        fieldName: 'estimation',
        fieldLabel: 'Estimation (h)',
      },
      {
        fieldName: 'totalTimeSpentByAll',
        fieldLabel: 'Total time spent by All',
      },
      {
        fieldName: 'myTimeSpentByPeriod',
        fieldLabel: 'My Time spent by Period (h)',
      },
      {
        fieldName: 'efficiency',
        fieldLabel: 'Efficiency',
      },
    ];

    // Parse data
    for(let dataObj of data){
      parsedData.push(parseObjectFields(dataObj, fieldsForParsing));
    }

    // Get first data item
    parsedDataItem = parsedData[0];

    // Prepare summary data
    if(this.fieldsForSummary.length > 0){
      for(let fieldForSummaryName of this.fieldsForSummary){
        let summaryDataItem = {};

        summaryDataItem.name = fieldForSummaryName;
        summaryDataItem.value = data.reduce((def, item) => {
          return def + +item[fieldForSummaryName];
        }, 0);

        summaryData.push(summaryDataItem);
      }
    }

    // Prepare table cells
    for(let dataItemField of parsedDataItem){
      let itemIndex = summaryData.findIndex((el) => {
        return el.name === dataItemField.name;
      });
      
      if(itemIndex !== -1){
        tableCellTemplate = `
          <div class="tasks-table__cell">
            <div class="tasks-table__cell-content">${summaryData[itemIndex].value}</div>
          </div>
        `;

        cells.push(tableCellTemplate);
      }

      if(itemIndex === -1){
        tableCellTemplate = `
          <div class="tasks-table__cell">
            <div class="tasks-table__cell-content">&nbsp;</div>
          </div>
        `;

        cells.push(tableCellTemplate);
      }
    }

    // Set first cell hardcoded value
    tableCellTemplate = `
      <div class="tasks-table__cell">
        <div class="tasks-table__cell-content">Sum</div>
      </div>
    `;
    cells[0] = tableCellTemplate;
    
    tableSummaryRow.innerHTML = cells.join('');
    return tableSummaryRow;
  }

  updateTableSummary(){
    this.clearTableSummary();

    let tableFooter = this.wrapperElement.querySelector('.tasks-table__footer');
    let newTableSummary = this.createTableSummary(this.data);

    if(tableFooter){
      tableFooter.before(newTableSummary);
    }

    if(!tableFooter){
      this.wrapperElement.append(newTableSummary);
    }

    return this;
  }

  clearTableSummary(){
    let tableSummary = this.wrapperElement.querySelector('.tasks-table__summary');

    if(tableSummary){
      tableSummary.remove();
    }

    return this;
  }

  // Table header functions
  createTableHeader(data){
    let tableHeader = document.createElement('div');
    tableHeader.classList.add('tasks-table__header');

    let dataObj = data[0];
    tableHeader.append(this.createTableHeaderRow(dataObj));

    return tableHeader;
  }

  createTableHeaderRow(dataObj){
    let tableHeaderRow = document.createElement('div');
    tableHeaderRow.classList.add('tasks-table__row');

    let fieldsForParsing = [
      {
        fieldName: 'taskName',
        fieldLabel: 'Task name',
      },
      {
        fieldName: 'developer',
        fieldLabel: 'Developer',
      },
      {
        fieldName: 'workType',
        fieldLabel: 'Work Type',
      },
      {
        fieldName: 'status',
        fieldLabel: 'Status',
      },
      {
        fieldName: 'estimation',
        fieldLabel: 'Estimation (h)',
      },
      {
        fieldName: 'totalTimeSpentByAll',
        fieldLabel: 'Total time spent by All',
      },
      {
        fieldName: 'myTimeSpentByPeriod',
        fieldLabel: 'My Time spent by Period (h)',
      },
      {
        fieldName: 'efficiency',
        fieldLabel: 'Efficiency',
      },
    ];

    let parsedFields = parseObjectFields(dataObj, fieldsForParsing);
    tableHeaderRow.innerHTML = this.getTableHeaderRowInnerHTML(parsedFields);

    return tableHeaderRow;
  }

  getTableHeaderRowInnerHTML(parsedFields){
    let tableCells = [];

    fillTableCellTemplate:
    for(let field of parsedFields){
      let tableCellTemplate = '';

      if(this.fieldsForSorting.length > 0){
        for(let fieldForSorting of this.fieldsForSorting){
          for(let key in fieldForSorting){
            if(key === field.name){
              tableCellTemplate = `
                <div class="tasks-table__header-cell">
                  <div class="tasks-table__cell-content">
                    <button class="tasks-table__sorting-button" data-sorting-field-name="${field.name}">
                      ${field.label}
                      <svg class="tasks-table__sorting-button-icon" width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8.77187 3.89743L7.02319 2.14743C6.82834 1.95218 6.51158 1.95218 6.31672 2.14743L4.56805 3.89743C4.37295 4.09268 4.37295 4.40918 4.56805 4.60443C4.7629 4.79968 5.07966 4.79968 5.27451 4.60443L6.17034 3.70793V13.5009C6.17034 13.7769 6.39417 14.0009 6.66996 14.0009C6.94575 14.0009 7.16958 13.7769 7.16958 13.5009V3.70793L8.0654 4.60443C8.16283 4.70218 8.29073 4.75093 8.41863 4.75093C8.54654 4.75093 8.67444 4.70218 8.77187 4.60443C8.96697 4.40918 8.96697 4.09268 8.77187 3.89743Z" fill="white"/>
                        <path d="M13.2684 11.3974C13.0733 11.2021 12.7571 11.2021 12.562 11.3974L11.6661 12.2939V2.50088C11.6661 2.22488 11.4423 2.00088 11.1665 2.00088C10.8907 2.00088 10.6669 2.22488 10.6669 2.50088V12.2939L9.77108 11.3974C9.57598 11.2021 9.25947 11.2021 9.06462 11.3974C8.86951 11.5926 8.86951 11.9091 9.06462 12.1044L10.8133 13.8544C10.911 13.9521 11.0386 14.0009 11.1665 14.0009C11.2944 14.0009 11.4221 13.9521 11.5197 13.8544L13.2684 12.1044C13.4635 11.9091 13.4635 11.5926 13.2684 11.3974Z" fill="white"/>
                      </svg>
                    </button>
                  </div>
                </div>
              `;

              tableCells.push(tableCellTemplate);
              continue fillTableCellTemplate;
            }
          }
        }
      }
      
      tableCellTemplate = `
        <div class="tasks-table__header-cell">
          <div class="tasks-table__cell-content">${field.label}</div>
        </div>
      `;

      tableCells.push(tableCellTemplate);
    }

    return tableCells.join('');
  }

  // Table body functions
  createTableBody(data){
    let tableBody = document.createElement('div');
    tableBody.classList.add('tasks-table__body');

    for(let dataObj of data){
      tableBody.append(this.createTableRow(dataObj));
    }

    return tableBody;
  }

  createTableRow(dataObj){
    let tableRow = document.createElement('div');
    tableRow.classList.add('tasks-table__row');

    let fieldsForParsing = [
      {
        fieldName: 'taskName',
        fieldLabel: 'Task name',
      },
      {
        fieldName: 'developer',
        fieldLabel: 'Developer',
      },
      {
        fieldName: 'workType',
        fieldLabel: 'Work Type',
      },
      {
        fieldName: 'status',
        fieldLabel: 'Status',
      },
      {
        fieldName: 'estimation',
        fieldLabel: 'Estimation (h)',
      },
      {
        fieldName: 'totalTimeSpentByAll',
        fieldLabel: 'Total time spent by All',
      },
      {
        fieldName: 'myTimeSpentByPeriod',
        fieldLabel: 'My Time spent by Period (h)',
      },
      {
        fieldName: 'efficiency',
        fieldLabel: 'Efficiency',
      },
    ];

    let parsedFields = parseObjectFields(dataObj, fieldsForParsing);
    tableRow.innerHTML = this.getTableRowInnerHTML(parsedFields);

    return tableRow;
  }

  getTableRowInnerHTML(parsedFields){
    let tableCells = [];

    for(let field of parsedFields){
      let statusClassNames = '';

      if(field.name === 'status'){
        statusClassNames = 'status ';

        switch(field.value.toLowerCase()){
          case 'completed':
            statusClassNames += 'status--success';
            break;

          case 'non completed':
            statusClassNames += 'status--error';
            break;
        }
      }
      
      let tableCellTemplate = `
        <div class="tasks-table__cell ${statusClassNames}">
          <div class="tasks-table__cell-label">${field.label}</div>
          <div class="tasks-table__cell-content">${field.value}</div>
        </div>
      `;

      tableCells.push(tableCellTemplate);
    }

    return tableCells.join('');
  }
}

// FUNCTIONS
function changeButtonSortingDirection(button){
  let sortingDirection = button.getAttribute('data-sorting-direction');

  switch(sortingDirection.toLowerCase()){
    case 'asc':
      button.setAttribute('data-sorting-direction', 'DESC');
      break;

    case 'desc':
      button.setAttribute('data-sorting-direction', 'ASC');
      break;
  }

  return button;
}

// ! For deprecation
function parseObjectFields(obj, fieldsForParsing = null){
  if(!fieldsForParsing){
    return obj;
  }

  let parsedFields = [];

  for(let field of fieldsForParsing){
    parsedFields.push({
      label: field.fieldLabel,
      value: obj[field.fieldName],
      name: field.fieldName,
    });
  }

  return parsedFields;
}

export default Table;