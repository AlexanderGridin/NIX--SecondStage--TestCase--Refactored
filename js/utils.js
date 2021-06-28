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

export default getDataFromUrl;