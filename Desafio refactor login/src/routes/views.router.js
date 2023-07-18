import { Router } from 'express';
import fs from 'fs';
import { ProductDBManager } from '../dao/managers/productDBManager.js';
import { CartDBManager } from '../dao/managers/cartDBManager.js';

const router = Router();
const productDBManager = new ProductDBManager();
const cartDBManager = new CartDBManager();

async function readProductsFromFile() {
  try {
    const data = await fs.readFileSync('./src/products.json', 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};


router.get('/register', (req, res) => {
  res.render('register')
})

router.get('/login', (req, res) => {
  res.render('login')
})

router.get('/', (req, res) => {
  res.render('profile');
})

router.get('/realtimeproducts', async (req, res) => {
  const products = await readProductsFromFile();
  res.render('realtimeproducts', { products: products });
});

router.get('/chat', async (req, res) => {
  res.render('chat', {})
});

router.get('/products', async (req, res) => {
  try {
    const limit = req.query.limit || 10;
    const page = req.query.page || 1;
    const sort = req.query.sort || null;
    const query = req.query.query || null;
    const userData = req.session.user;

    const products = await productDBManager.getProducts(limit, page, sort, query);
    res.render('products', { products , userData });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

router.get('/carts/:cid', async (req, res) => {
  const cid = req.params.cid;
  try {
    const cart = await cartDBManager.getCartsById(cid);

    res.render('carts', { cart });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

export default router;