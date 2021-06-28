import TableHeaderRow from '../TableHeaderRow/TableHeaderRow.js';

function prepareChildrens(props){
  let childrens = [];
  let task = props[0];
  let tableRow = new TableHeaderRow(task);
  childrens.push(tableRow);

  return childrens;
}

export {prepareChildrens};