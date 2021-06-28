import TableRow from '../TableRow/TableRow.js';

function prepareChildrens(props){
  let childrens = [];

  for(let task of props){
    let tableRow = new TableRow(task);
    childrens.push(tableRow);
  }

  return childrens;
}

export {prepareChildrens};