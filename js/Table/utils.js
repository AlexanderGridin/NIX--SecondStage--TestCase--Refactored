const utils = {
  removeClassFromElements(elements, classToRemove){
    for(let el of elements){
      if(el.classList.contains(classToRemove)){
        el.classList.remove(classToRemove);
      }
    }

    return elements;
  }
}

export {utils};