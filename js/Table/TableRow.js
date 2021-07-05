export default class TableRow{
  constructor({
    tableTagName,
    data,
  }){
    this.tableTagName = tableTagName;
    this.data = data;
    this.element = null;
    this.cells = [];

    this._createElement();
  }

  _createElement(){
    if(this.tableTagName === 'div'){
      this.element = document.createElement(this.tableTagName);
    }

    if(this.tableTagName === 'table'){
      this.element = document.createElement('tr');
    }

    return this;
  }

  addClassName(className){
    this.element.classList.add(className);
    return this;
  }

  addCell(cell){
    this.cells.push(cell);
    return this;
  }

  build(){
    for(let cell of this.cells){
      this.element.append(cell.element);
    }

    return this;
  }
}