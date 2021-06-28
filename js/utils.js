async function getDataFromUrl(url){
  let response = null;

  response = await fetch(url)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      return data;
    });

  return response;
}

function removeClassFromElements(elements, classToRemove){
  for(let el of elements){
    if(el.classList.contains(classToRemove)){
      el.classList.remove(classToRemove);
    }
  }

  return elements;
}

export {getDataFromUrl, removeClassFromElements};