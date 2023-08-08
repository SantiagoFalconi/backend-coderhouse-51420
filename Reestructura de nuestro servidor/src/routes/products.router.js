import { Router } from "express";
import { getProductsWithFilter, getProductsById, updateProductById, addNewProduct, deleteProductById } from '../controllers/products.controller.js'

const router = Router();

router.get('/', getProductsWithFilter);

router.get('/:pid', getProductsById);

router.put('/:pid', updateProductById);

router.post('/', addNewProduct);

router.delete('/:pid', deleteProductById);

export default router;
