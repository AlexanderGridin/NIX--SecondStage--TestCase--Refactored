export default class TableItemEntity{
  constructor({
    name,
    title,
    handlers,
    sorter,
    summary,
  }){
    this.name = name ? name: '';
    this.title = title ? title : '';
    this.handlers = handlers ? handlers : null;

    if(sorter){
      let {
        type: sorterType, 
        className: sorterClassName, 
        icon: sorterIcon
      } = sorter;

      this.sorter = {
        type: sorterType,
        className: sorterClassName,
        icon: sorterIcon,
      }
    }

    this.summary = summary ? summary : false;
  }
}