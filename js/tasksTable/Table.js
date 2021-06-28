class Table{
  constructor(elementSelector){
    this.element = document.querySelector(elementSelector);
    this.fieldsForSorting = [];
    this.tableData = null;
  }

  build(data){
    this.tableData = data;

    this.element.prepend(this.createTableBody(data));
    this.element.prepend(this.createTableHeader(data));

    this.handleSortingButtons(this.fieldsForSorting);

    return this;
  }

  setLoader(){
    this.element.classList.add('loading');
  }

  removeLoader(){
    this.element.classList.remove('loading');
  }

  enableSortByFields(...fieldNames){
    for(let name of fieldNames){
      let field = {};
      field[name] = true;

      this.fieldsForSorting.push(field);
    }

    return this;
  }

  updateBody(data){
    let tableHeader = this.element.querySelector('.tasks-table__header');

    this.clearBody();
    let newTableBody = this.createTableBody(data);

    if(tableHeader){
      tableHeader.after(newTableBody);
    }

    if(!tableHeader){
      this.element.prepend(newTableBody);
    }

    this.tableData = data;

    return this;
  }

  clearBody(){
    let body = this.element.querySelector('.tasks-table__body');

    if(body){
      body.remove();
    }

    this.tableData = null;

    return this;
  }

  handleSortingButtons(fieldsForSorting){
    if(fieldsForSorting.length === 0){
      return;
    }

    let self = this;
    let sortingButtons = this.element.querySelectorAll('[data-sorting-field-name]');

    for(let button of sortingButtons){
      button.addEventListener('click', function(e){
        e.preventDefault();
        e.stopPropagation();

        // Set sorting direction attribute if it absent
        if(!button.hasAttribute('data-sorting-direction')){
          button.setAttribute('data-sorting-direction', 'ASC');
        }

        let sortingFieldName = button.getAttribute('data-sorting-field-name');
        let sortingDirection = button.getAttribute('data-sorting-direction');

        let sortedData = self.sortTableDataByField(sortingFieldName, sortingDirection);

        self.clearBody();
        self.updateBody(sortedData);

        changeButtonSortingDirection(button);

        removeClassFromElements(sortingButtons, 'sorted')
        button.classList.add('sorted');
      });
    }
  }

  sortTableDataByField(fieldName, sortDirection){
    let sortedData = null;
    sortDirection = sortDirection.toLowerCase();

    // TODO: это очень плохой кусок кода...его нужно отрефакторить
    if(fieldName.toLowerCase() === 'efficiency'){
      switch(sortDirection){
        case 'asc':
          sortedData = this.tableData.sort((a, b) => {
            a = a[fieldName].match(/\d/g);
            b = b[fieldName].match(/\d/g);

            // a
            if(a === null){
              a = 0;
            }

            if(a !== null){
              a = +a.join('');
            }

            // b
            if(b === null){
              b = 0;
            } 
            
            if(b !== null){
              b = +b.join('');
            }

            return a - b;
          });
          break;

        case 'desc':
          sortedData = this.tableData.sort((a, b) => {
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
        sortedData = this.tableData.sort((a, b) => {
          return +a[fieldName] - +b[fieldName];
        });
        break;

      case 'desc':
        sortedData = this.tableData.sort((a, b) => {
          return +b[fieldName] - +a[fieldName];
        });
        break;
    }

    return sortedData;
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

function removeClassFromElements(elements, classToRemove){
  for(let el of elements){
    if(el.classList.contains(classToRemove)){
      el.classList.remove(classToRemove);
    }
  }

  return elements;
}

export default Table;