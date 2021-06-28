import {getDataFromUrl} from '../utils.js';
import Table from './Table.js';
import Pagination from './Pagination.js';

document.addEventListener('DOMContentLoaded', main);

function main(){
  let dataUrl = 'http://f0541354.xsph.ru/tasks';
  let table = new Table('#tasks-table');
  let pagination = new Pagination('.pagination');

  table.enableSortByFields('efficiency', 'myTimeSpentByPeriod', 'totalTimeSpentByAll', 'estimation');
  pagination.setElementForPagging(table);

  getDataFromUrl(dataUrl).then((data) => {
    table.build(data);
  });
}