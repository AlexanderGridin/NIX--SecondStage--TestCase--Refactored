class ReVue{
  constructor(rootElementSelector){
    this.components = [];
    this.elementsCounter = 0;
    this.rootElement = document.querySelector(rootElementSelector);
  }

  sayHello(){
    console.log('ReVue!');
  }

  getComponentByName(name){
    let findedComponent = this.components.find((component) => {
      return component.name === name;
    });

    return findedComponent;
  }

  build(components){
    console.time('ReVue build()');

    let app = this.rootElement;

    if(app && components && components.length > 0){
      for(let component of components){
        app.append(mergeComponents(component));
      }
    }

    console.timeEnd('ReVue build()');
  }
}

function mergeComponents(parent){
  if(parent.childrens.length === 0){
    return parent.element;
  }

  parent.childrens.forEach((child) => {
    parent.element.append(mergeComponents(child));
  });

  return parent.element;
}

export default ReVue;