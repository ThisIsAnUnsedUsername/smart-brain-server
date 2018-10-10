function getPages(url) {
  let store;
  fetch(url)
    .then(response => {
      response.json();
      console.log(response.json());
    })
    .then(data => {
      store = data;
      console.log(data);
    });
  return store;
}
var test = getPages('https://jsonplaceholder.typicode.com/posts');

fetch('https://jsonplaceholder.typicode.com/posts')
  .then(response => response.json())
  .then(data => {
    store = data;
    console.log(data);
  });

var a = await fetch('https://jsonplaceholder.typicode.com/posts').then(
  response => response.json()
);
a;

async function getPage(url) {
  let store;
  const a = await fetch(url)
    .then(response => response.json())
    .then(data => (store = data));
  return store;
}
getPage('https://jsonplaceholder.typicode.com/posts');
