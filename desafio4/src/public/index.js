const socket = io();

socket.on('products', (products) => {
    console.log(products);
  });
