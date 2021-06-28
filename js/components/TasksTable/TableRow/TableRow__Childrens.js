import TableCell from '../TableCell/TableCell.js';

function prepareChildrens(props){
  let {
    taskName, 
    developer, 
    workType, 
    status, 
    estimation,
    totalTimeSpentByAll,
    myTimeSpentByPeriod,
    efficiency
  } = props;
  
  let childrens = [];

  childrens.push(new TableCell({
    label: 'Task Name',
    content: taskName,
  }));

  childrens.push(new TableCell({
    label: 'Developer',
    content: developer,
  }));

  childrens.push(new TableCell({
    label: 'Work Type',
    content: workType,
  }));

  childrens.push(new TableCell({
    label: 'Status',
    content: status,
  }));

  childrens.push(new TableCell({
    label: 'Estimation (h)',
    content: estimation,
  }));

  childrens.push(new TableCell({
    label: 'Total time spent by All',
    content: totalTimeSpentByAll,
  }));

  childrens.push(new TableCell({
    label: 'My Time spent by Period (h)',
    content: myTimeSpentByPeriod,
  }));

  childrens.push(new TableCell({
    label: 'Efficiency',
    content: efficiency,
  }));

  return childrens;
}

export {prepareChildrens};