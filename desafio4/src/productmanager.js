import fs from 'fs';

class Product {
  static idCounter = 1;

  constructor(title, description, price, thumbnail, code, stock, status, category){
    this.id = Product.idCounter++;
    this.title = title;
    this.description = description;
    this.price = price;
    this.thumbnail = thumbnail;
    this.code = code;
    this.stock = stock;
    this.status = status;
    this.category = category;
  }
}

class ProductManager {

  constructor(path){
    this.products = [];
    this.path = path;
    this.loadProductsFromFile();
  }

  async loadProductsFromFile() {
    try {
      const data = await fs.promises.readFile(this.path, 'utf-8');
      this.products = JSON.parse(data);
    } catch (error) {
      this.products = [];
     }
  }

  async saveProductsToFile() {
    try {
      const data = JSON.stringify(this.products);
      await fs.promises.writeFile(this.path, data, 'utf-8');
    } catch (error) {
      throw error;
      }
  }

  addProduct(title, description, price, thumbnail, code, stock, status, category){
    const newProduct = new Product (title, description, price, thumbnail, code, stock,status, category)
    if(!this.products.find(product => product.code === newProduct.code)){
      this.products.push(newProduct);
      this.saveProductsToFile();
      return newProduct.id;
    }
  }

  getProducts() {
    try {
      const data = fs.readFileSync(this.path, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
        return [];
      }
  }

  getProductById(id) {
    this.loadProductsFromFile();
    const product = this.products.find((product) => product.id === id);
    if (product) {
      return product;
    } else {
        return null;
      }
  }

  updateProduct(id, update) {
    const product = this.products.find((product) => product.id === id);
    if (product) {
      Object.assign(product, update);
      this.saveProductsToFile();
      return product;
    } else {
        return null;
      }
  }

  deleteProduct(id) {
    const index = this.products.findIndex((product) => product.id === id);
    if (index > 0) {
      this.products.splice(index, 1);
      this.saveProductsToFile();
      return this.products;
    } else {
        return this.products;
      }
  }
}

const productManager = new ProductManager('./src/products.json');

productManager.addProduct('Buzo1','Buzo cuello redondo',15000,[],30,2,true,'Buzos');
productManager.addProduct('Remera1','Remera cuello redondo',9000,[],20,1,true,'Remeras');
productManager.addProduct('Campera1','Campera cuello redondo',60000,[],40,10,true,'Camperas');
productManager.addProduct('Camisa1','Camisa cuello redondo',2000,[],10,6,true,'Camisas');




