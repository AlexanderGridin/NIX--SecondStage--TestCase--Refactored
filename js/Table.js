class Table{
  constructor(elementSelector){
    this.element = document.querySelector(elementSelector);
  }

  build(data){
    this.element.prepend(createTableBody(data));
    this.element.prepend(createTableHeader());

    return this;
  }

  setLoader(){
    this.element.classList.add('loading');
  }

  removeLoader(){
    this.element.classList.remove('loading');
  }

  updateBody(data){
    let tableHeader = this.element.querySelector('.tasks-table__header');

    this.clearBody();
    let newTableBody = createTableBody(data);

    if(tableHeader){
      tableHeader.after(newTableBody);
    }

    if(!tableHeader){
      this.element.prepend(newTableBody);
    }

    return this;
  }

  clearBody(){
    let body = this.element.querySelector('.tasks-table__body');

    if(body){
      body.remove();
    }

    return this;
  }
}

function createTableHeader(){
  let tableHeader = document.createElement('div');
  tableHeader.classList.add('tasks-table__header');

  let tableHeaderInner = `
    <div class="tasks-table__row">
      <div class="tasks-table__header-cell">
        <div class="tasks-table__cell-content">Task name</div>
      </div>
      <div class="tasks-table__header-cell">
        <div class="tasks-table__cell-content">Developer</div>
      </div>
      <div class="tasks-table__header-cell">
        <div class="tasks-table__cell-content">Work Type</div>
      </div>
      <div class="tasks-table__header-cell">
        <div class="tasks-table__cell-content">Status</div>
      </div>
      <div class="tasks-table__header-cell">
        <div class="tasks-table__cell-content">Estimation (h)</div>
      </div>
      <div class="tasks-table__header-cell">
        <div class="tasks-table__cell-content">Total time spent by All</div>
      </div>
      <div class="tasks-table__header-cell">
        <div class="tasks-table__cell-content">My Time spent by Period (h)</div>
      </div>
      <div class="tasks-table__header-cell">
        <div class="tasks-table__cell-content">Efficiency</div>
      </div>
    </div>
  `;

  tableHeader.innerHTML = tableHeaderInner;

  return tableHeader;
}

function createTableBody(data){
  let tableBody = document.createElement('div');
  tableBody.classList.add('tasks-table__body');

  for(let dataObj of data){
    tableBody.append(createTableRow(dataObj));
  }

  return tableBody;
}

function createTableRow(dataObj){
  let tableRow = document.createElement('div');
  tableRow.classList.add('tasks-table__row');

  let fieldsForParsing = [
    {
      fieldName: 'taskName',
      fieldLabel: 'Task ame',
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
  tableRow.innerHTML = getTableRowInnerHTML(parsedFields);

  return tableRow;
}

function getTableRowInnerHTML(parsedFields){
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