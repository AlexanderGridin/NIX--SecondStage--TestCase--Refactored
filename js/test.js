let data = null;
let dataStatus = false;

// fetch('http://f0541354.xsph.ru/tasks')
//   .then((response) => {
//     return response.json();
//   })
//   .then((data) => {
//     dataStore = data;
//     console.log(data);
//   });

async function getData(pageNumber = 0){
  let response = null;

  if(pageNumber === 0){
    response = await fetch(`http://f0541354.xsph.ru/tasks`)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        return data;
      });
  }

  if(pageNumber > 0){
    response = await fetch(`http://f0541354.xsph.ru/tasks?page=${pageNumber}`)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        return data;
      });
  }

  return response;
}

getData().then((data) => {
  console.log('data page 1');
  console.log(data);
});

getData(1).then((data) => {
  console.log('data page 2');
  console.log(data);
});