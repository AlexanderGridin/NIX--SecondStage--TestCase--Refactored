import ReVue from './ReVue/ReVue.js';
import Table from './components/TasksTable/Table/Table.js';

import {data} from './testData.js';

let tasksTableApp = new ReVue('.tasks-table');
let tasksTable = new Table(data);

tasksTableApp.build([
  tasksTable,
]);
console.log(tasksTableApp);
console.log(tasksTable.props)
console.log(data)

// TODO:
// getData().then((data) => {
//   console.log('data page 1');
//   console.log(data);
// });

async function getData(pageNumber = 0){
  let response = null;

  if(pageNumber === 0){
    response = await fetch(`http://f0541354.xsph.ru/tasks`)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        return data;
      });
  }

  if(pageNumber > 0){
    response = await fetch(`http://f0541354.xsph.ru/tasks?page=${pageNumber}`)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        return data;
      });
  }

  return response;
}