import { Router } from "express";
import { getProductsWithFilter, getProductsById, updateProductById, addNewProduct, deleteProductById, } from '../controllers/products.controller.js';
import { mockingproducts } from '../controllers/mocking.controller.js';
import { checkRole } from '../controllers/users.controller.js';
import { checkProductPermissions } from '../controllers/users.controller.js';

const router = Router();

router.get('/', getProductsWithFilter);

router.get('/:pid', getProductsById);

router.put('/:pid',checkRole('admin'), updateProductById );

router.post('/', [checkRole('admin'), checkRole('premium')], addNewProduct);

router.delete('/:pid', [checkRole('admin'), checkProductPermissions], deleteProductById);

router.get('/mockingproducts', mockingproducts);

export default router;
