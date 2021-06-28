import TableCellLabel from '../TableCellLabel/TableCellLabel.js';
import TableCellContent from '../TableCellContent/TableCellContent.js';

function prepareChildrens(props){
  let childrens = [];

  if(props.label){
    childrens.push(new TableCellLabel(props));
  }
  
  if(props.content){
    childrens.push(new TableCellContent(props));
  }

  return childrens;
}

export {prepareChildrens};