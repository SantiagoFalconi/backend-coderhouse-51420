import { Router } from "express";
import { getProductsWithFilter, getProductsById, updateProductById, addNewProduct, deleteProductById, } from '../controllers/products.controller.js';
import { mockingproducts } from '../controllers/mocking.controller.js';
import { checkRole } from '../config/passport.config.js';

const router = Router();

router.get('/', getProductsWithFilter);

router.get('/:pid', getProductsById);

router.put('/:pid', updateProductById , checkRole('admin'));

router.post('/', addNewProduct, checkRole('admin'));

router.delete('/:pid', deleteProductById, checkRole('admin'));

router.get('/mockingproducts', mockingproducts);

export default router;
