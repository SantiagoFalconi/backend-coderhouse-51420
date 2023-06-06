import fs from 'fs';

class Cart {
  static idCounter = 1;

  constructor(products){
    this.id = Cart.idCounter++;
    this.products = products;
  }
}

class CartsManager {

  constructor(path){
    this.carts = [];
    this.path = path;
    this.loadCartsFromFile();
  }

  async loadCartsFromFile() {
    try {
      const data = await fs.promises.readFile(this.path, 'utf-8');
      this.carts = JSON.parse(data);
    } catch (error) {
        this.carts = [];
     }
  }

  async saveCartsToFile() {
    try {
      const data = JSON.stringify(this.carts);
      await fs.promises.writeFile(this.path, data, 'utf-8');
    } catch (error) {
      throw error;
      }
  }

  addCart(products) {
    const newCart = new Cart(products);
    this.carts.push(newCart);
    this.saveCartsToFile();
    return newCart.id;
  }
}

const cartManager = new CartsManager('./src/carts.json');

cartManager.addCart([
  { product: 28, quantity: 2 },
  { product: 12, quantity: 1 }
]);
cartManager.addCart([
  { product: 20, quantity: 2 },
  { product: 40, quantity: 1 }
]);
cartManager.addCart([
  { product: 14, quantity: 2 },
  { product: 11, quantity: 1 }
]);
cartManager.addCart([
  { product: 30, quantity: 2 },
  { product: 36, quantity: 1 }
]);