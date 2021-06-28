import {getDataFromUrl} from './utils.js';
import Table from './Table/Table.js';
import Pagination from './Pagination/Pagination.js';

document.addEventListener('DOMContentLoaded', main);

function main(){
  handleMobileMenuButton({
    menuButtonSelector: '.horizontal-nav__mobile-button', 
    menuListSelector: '.horizontal-nav__list',
  });

  initTableAndPagination();
}

// Functions
function initTableAndPagination(){
  let dataUrl = 'http://f0541354.xsph.ru/tasks';
  let table = new Table('#tasks-table');
  let pagination = new Pagination('.pagination');

  pagination.setElementForPagging(table);

  table.enableSortByFields('efficiency', 'myTimeSpentByPeriod', 'totalTimeSpentByAll', 'estimation');
  table.setFieldsForSummary('totalTimeSpentByAll', 'myTimeSpentByPeriod');
  table.setLoader();

  getDataFromUrl(dataUrl).then((data) => {
    table.build(data);
    table.removeLoader();
  });
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