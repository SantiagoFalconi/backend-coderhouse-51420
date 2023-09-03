import { Router } from 'express';
import fs from 'fs';
import { getCartsById , getProducts , getChat , getProfile } from '../controllers/views.controller.js';
import { getLogger } from '../controllers/logger.controller.js';
import { checkRole } from '../config/passport.config.js';

const router = Router();

async function readProductsFromFile() {
  try {
    const data = await fs.readFileSync('./src/products.json', 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

router.get('/realtimeproducts', async (req, res) => {
  const products = await readProductsFromFile();
  res.render('realtimeproducts', { products: products });
});

router.get('/loggerTest', getLogger );

router.get('/', getProfile);

router.get('/chat', getChat, checkRole('user'));

router.get('/products', getProducts,);

router.get('/carts/:cid', getCartsById);

export default router;