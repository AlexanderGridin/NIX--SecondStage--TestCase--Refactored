import {getDataFromUrl} from './utils.js';
import Table from './Table/Table.js';
import Pagination from './Pagination/Pagination.js';

document.addEventListener('DOMContentLoaded', main);

function main(){
  handleMobileMenuButton({
    menuButtonSelector: '.horizontal-nav__mobile-button', 
    menuListSelector: '.horizontal-nav__list',
  });

  initDynamicElements();
}

// Functions
function initDynamicElements(){
  let table = initTable();
  table.setLoader();
  console.log(table);

  let pagination = initPagination();
  console.log(pagination);

  table.footer.element.append(pagination.wrapper);

  pagination.nextPage((dataUrl) => {
    table.setLoader();
    console.log(dataUrl)

    getDataFromUrl(dataUrl).then((data) => {
      table.updateBody(data).removeLoader();
    });
  });

  pagination.prevPage((dataUrl) => {
    table.setLoader();
    console.log(dataUrl)

    getDataFromUrl(dataUrl).then((data) => {
      table.updateBody(data).removeLoader();
    });
  });

  pagination.selectPage((dataUrl) => {
    table.setLoader();
    console.log(dataUrl)

    getDataFromUrl(dataUrl).then((data) => {
      table.updateBody(data).removeLoader();
    });
  });

  let dataUrl = 'http://f0541354.xsph.ru/tasks';
  getDataFromUrl(dataUrl).then((data) => {
    table.build(data).removeLoader();
  });
}

function initTable(){
  let tableSorterIcon = `
    <svg class="tasks-table__sorting-button-icon" width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8.77187 3.89743L7.02319 2.14743C6.82834 1.95218 6.51158 1.95218 6.31672 2.14743L4.56805 3.89743C4.37295 4.09268 4.37295 4.40918 4.56805 4.60443C4.7629 4.79968 5.07966 4.79968 5.27451 4.60443L6.17034 3.70793V13.5009C6.17034 13.7769 6.39417 14.0009 6.66996 14.0009C6.94575 14.0009 7.16958 13.7769 7.16958 13.5009V3.70793L8.0654 4.60443C8.16283 4.70218 8.29073 4.75093 8.41863 4.75093C8.54654 4.75093 8.67444 4.70218 8.77187 4.60443C8.96697 4.40918 8.96697 4.09268 8.77187 3.89743Z" fill="white"/>
      <path d="M13.2684 11.3974C13.0733 11.2021 12.7571 11.2021 12.562 11.3974L11.6661 12.2939V2.50088C11.6661 2.22488 11.4423 2.00088 11.1665 2.00088C10.8907 2.00088 10.6669 2.22488 10.6669 2.50088V12.2939L9.77108 11.3974C9.57598 11.2021 9.25947 11.2021 9.06462 11.3974C8.86951 11.5926 8.86951 11.9091 9.06462 12.1044L10.8133 13.8544C10.911 13.9521 11.0386 14.0009 11.1665 14.0009C11.2944 14.0009 11.4221 13.9521 11.5197 13.8544L13.2684 12.1044C13.4635 11.9091 13.4635 11.5926 13.2684 11.3974Z" fill="white"/>
    </svg>
  `;

  let table = new Table('#tasks-table', {
    tagName: 'div',
    classNames: {
      body: 'tasks-table__body',
      row: 'tasks-table__row',
      cell: 'tasks-table__cell',
    },

    header: {
      create: true,
      className: 'tasks-table__header',
    },
    summary: {
      create: true,
      className: 'tasks-table__summary',
      title: 'Sum',
    },
    footer: {
      create: true,
      className: 'tasks-table__footer',
    },

    columns: [
      {
        name: 'taskName',
        title: 'Task name',
      },
      {
        name: 'developer',
        title: 'Developer',
      },
      {
        name: 'workType',
        title: 'Work Type',
      },
      {
        name: 'status',
        title: 'Status',
        handlers: [
          function(){
            if(this.name === 'status'){
              this.element.classList.add('status');

              switch(this.value.toLowerCase()){
                case 'completed':
                  this.element.classList.add('status--success');
                  break;

                case 'non completed':
                  this.element.classList.add('status--error');
                  break;
              }
            }
          }
        ],
      },
      {
        name: 'estimation',
        title: 'Estimation (h)',
        sorter: {
          type: 'number',
          className: 'tasks-table__sorting-button',
          icon: tableSorterIcon,
        },
      },
      {
        name: 'totalTimeSpentByAll',
        title: 'Total time spent by All',
        sorter: {
          type: 'number',
          className: 'tasks-table__sorting-button',
          icon: tableSorterIcon,
        },
        summary: true,
      },
      {
        name: 'myTimeSpentByPeriod',
        title: 'My Time spent by Period (h)',
        sorter: {
          type: 'number',
          className: 'tasks-table__sorting-button',
          icon: tableSorterIcon,
        },
        summary: true,
      },
      {
        name: 'efficiency',
        title: 'Efficiency',
        sorter: {
          type: 'number',
          className: 'tasks-table__sorting-button',
          icon: tableSorterIcon,
        },
      },
    ],
    bodyCellInnerTemplate: `
      <div class="tasks-table__cell-label">
        @title
      </div>
      <div class="tasks-table__cell-content">
        @value
      </div>
    `,
  });

  // Определяем методы для работы с Лоадером
  table.setLoader = function(){
    this.wrapperElement.classList.add('loading');
  };

  table.removeLoader = function(){
    this.wrapperElement.classList.remove('loading');
  }

  return table;
}

function initPagination(){
  let pagination = new Pagination({
    selectItemsPerPage: true,
    summary: true,
    pagesButtons: [
      {
        href: 'http://f0541354.xsph.ru/tasks',
      },
      {
        href: 'http://f0541354.xsph.ru/tasks?page=1',
      },
      {
        href: 'http://f0541354.xsph.ru/tasks',
      },
    ],
  });

  return pagination;
}

function handleMobileMenuButton({menuButtonSelector, menuListSelector}){
  let menuButton = document.querySelector(menuButtonSelector);
  let menuList = document.querySelector(menuListSelector);

  let toggleClassName = 'visible';

  if(menuButton && menuList){
    menuButton.addEventListener('click', function(e){
      e.preventDefault();
      e.stopPropagation();

      menuList.classList.toggle(toggleClassName);
    }, false);
  }
}