import { Router } from 'express';
import fs from 'fs';
import { getCartsById , getProducts , getChat , getProfile } from '../controllers/views.controller.js';
import { getLogger } from '../controllers/logger.controller.js';
import { checkRole } from '../controllers/users.controller.js';
import UsersManager from '../services/db/dao/managers/usersManager.js';

const router = Router();
const uManager = new UsersManager();

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

router.get('/admin/users', checkRole('admin'), async (req, res) => {
  const users = await uManager.getAllUsers();
  res.render('adminUsersView', { users });
});

router.get('/admin/users/:userId/edit', (req, res) => {
});

router.get('/admin/users/:userId/delete', (req, res) => {
});

router.get('/chat', checkRole('user'), getChat);

router.get('/products', getProducts,);

router.get('/carts/:cid', getCartsById);

export default router;