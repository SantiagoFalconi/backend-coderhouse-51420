import { CartDBManager } from '../dao/managers/cartDBManager.js';
import { ProductDBManager } from '../dao/managers/productDBManager.js';

const cartDBManager = new CartDBManager();
const productDBManager = new ProductDBManager();

export const getCartsById = async (req, res) => {
    const cid = req.params.cid;
    try {
      const cart = await cartDBManager.getCartsById(cid);
  
      res.render('carts', { cart });
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
}

export const getProducts = async (req, res) => {
    try {
      const limit = req.query.limit || 10;
      const page = req.query.page || 1;
      const sort = req.query.sort || null;
      const query = req.query.query || null;
  
      const products = await productDBManager.getProducts(limit, page, sort, query);
      res.render('products', { products });
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
}

export const getChat = async (req, res) => {
    res.render('chat', {})
}

export const getProfile = (req, res) => {
    res.render('profile');
}