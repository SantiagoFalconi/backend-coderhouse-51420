const socket = io();

socket.on('productList', (products) => {

  console.log(products);
  const productList = document.getElementById('product-list');

  productList.innerHTML = '';

  products.forEach((product) => {
    const listItem = document.createElement('li');
    const productDetails = `ID: ${product.id}, Nombre: ${product.title}, Descripción: ${product.description}, Precio: ${product.price}, Código: ${product.code}, Stock: ${product.stock}, Categoría: ${product.category}`;
    listItem.textContent = productDetails;
    productList.appendChild(listItem);
  });
});
