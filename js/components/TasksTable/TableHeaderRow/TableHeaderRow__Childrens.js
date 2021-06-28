import TableHeaderCell from '../TableHeaderCell/TableHeaderCell.js';

function prepareChildrens(props){
  let childrens = [];

  childrens.push(new TableHeaderCell({
    content: 'Task Name',
  }));

  childrens.push(new TableHeaderCell({
    content: 'Developer',
  }));

  childrens.push(new TableHeaderCell({
    content: 'Work Type',
  }));

  childrens.push(new TableHeaderCell({
    content: 'Status',
  }));

  childrens.push(new TableHeaderCell({
    content: 'Estimation (h)',
  }));

  childrens.push(new TableHeaderCell({
    content: 'Total time spent by All',
  }));

  childrens.push(new TableHeaderCell({
    content: 'My Time spent by Period (h)',
  }));

  childrens.push(new TableHeaderCell({
    content: 'Efficiency',
  }));

  return childrens;
}

export {prepareChildrens};