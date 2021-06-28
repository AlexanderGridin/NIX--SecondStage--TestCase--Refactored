import TableHeader from '../TableHeader/TableHeader.js';
import TableBody from '../TableBody/TableBody.js';

function prepareChildrens(props){
  let tableHeader = new TableHeader(props);
  let tableBody = new TableBody(props);

  return [
    tableHeader,
    tableBody,
  ];
}

export {prepareChildrens};