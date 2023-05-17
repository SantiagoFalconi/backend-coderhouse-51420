import fs from 'fs';

class Product {
  static idCounter = 1;

  constructor(title, description, price, thumbnail, code, stock){
    this.title = title;
    this.description = description;
    this.price = price;
    this.thumbnail = thumbnail;
    this.code = code;
    this.stock = stock;
    this.id = Product.idCounter++;
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
        console.error('Error reading products file:', error);
        this.products = [];
     }
  }

  async saveProductsToFile() {
    try {
      const data = JSON.stringify(this.products);
      await fs.promises.writeFile(this.path, data, 'utf-8');
    } catch (error) {
        console.error('Error writing products file:', error);
      }
  }

  addProduct(title, description, price, thumbnail, code, stock){
    const newProduct = new Product (title, description, price, thumbnail, code, stock)
    if(!this.products.find(product => product.code === newProduct.code)){
        this.products.push(newProduct);
        this.saveProductsToFile();
    }
  }

  getProducts () {
    try {
      const data = fs.readFileSync(this.path, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
        console.error('Error reading products file:', error);
        return [];
      }
  }

  getProductById(id) {
    this.loadProductsFromFile();
    const product = this.products.find((product) => product.id === id);
    if (product) {
      return product;
    } else {
        console.error('Product not found');
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
        console.error('Product not found');
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
        console.error('Product not found');
        return this.products;
      }
  }
}

const productManager = new ProductManager('./products.json');

productManager.addProduct('Buzo','Buzo cuello redondo',15000,'src/img/buzocr.jpg',30,2);
productManager.addProduct('Remera','Remera cuello redondo',9000,'src/img/remeracr.jpg',20,1);
productManager.addProduct('Campera','Campera cuello redondo',60000,'src/img/camperacr.jpg',40,10);
productManager.addProduct('Camisa','Camisa cuello redondo',2000,'src/img/camisacr.jpg',10,6);




