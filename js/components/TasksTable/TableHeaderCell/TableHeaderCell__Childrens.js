import TableCellContent from '../TableCellContent/TableCellContent.js';

function prepareChildrens(props){
  let childrens = [];
  
  if(props.content){
    childrens.push(new TableCellContent(props));
  }

  return childrens;
}

export {prepareChildrens};