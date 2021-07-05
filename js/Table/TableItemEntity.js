/**
 * Костя, в этом и других классах использовано много деструктуризации.
 * Основная идея - наглядное представление всех свойств класса и параметров конструктора.
 * Очень интересно было бы узнать, применяется ли такой подход на реальных проектах + узнать свои ошибки при применении данного подхода, т.к. подозреваем, что местами она избыточна, но на дополнительный рефакторинг времени не осталось :(
 */

/**
 * Также, не успели нормально упорядочить методы...
 */
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