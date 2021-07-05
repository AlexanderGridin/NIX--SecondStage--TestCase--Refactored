/**
 * Костя, в этом и других классах я использовал много деструктуризации.
 * Основная идея - наглядное представление всех свойств класса и параметров конструктора.
 * Очень интересно было бы узнать, применяется ли такой подход на реальных проектах + узнать свои ошибки при применении данного подхода, т.к. подозреваю, что местами она избыточна, но на дополнительный рефакторинг времени у меня не осталось :(
 * ...Гридин.
 */

/**
 * Также, не успел нормально упорядочить методы...Хотя в этом классе вроде все более-менее нормально...
 * ...Гридин.
 */
export default class DOMObject{
  tagName;
  element;
  classNames;
  attributes;
  content;
  childrens;

  constructor({
    tagName,
    classNames,
    attributes,
    content,
    childrens,
  }){
    this.tagName = tagName ? tagName : 'div';
    this.classNames = classNames ? classNames.split(' ') : [];
    this.attributes = attributes ? attributes : null;
    this.content = content ? content : '';
    this.childrens = childrens ? childrens : [];

    this._init();
  }

  _init(){
    this._createElement()
      ._setClassNames()
      ._setAttributes()
      ._setContent()
      ._appendChildrens();

    return this;
  }

  _createElement(){
    this.element = document.createElement(this.tagName);
    return this;
  }

  _setClassNames(){
    if(this.classNames.length === 0){
      return this;
    }

    for(let className of this.classNames){
      this.element.classList.add(className);
    }

    return this;
  }

  _setAttributes(){
    if(!this.attributes){
      return this;
    }

    for(let attrName in this.attributes){
      this.element.setAttribute(attrName, this.attributes[attrName]);
    }

    return this;
  }

  _setContent(){
    this.element.innerHTML = this.content;
    return this;
  }

  _appendChildrens(){
    if(!this.childrens.length === 0){
      return this;
    }

    for(let child of this.childrens){
      this.element.append(child.element);
    }

    return this;
  }

  addChild(child){
    this.childrens.push(child);
    this.element.append(child.element);

    return this;
  }

  addChildrens(...childrens){
    for(let child of childrens){
      this.childrens.push(child);
      this.element.append(child.element);
    }

    return this;
  }
}