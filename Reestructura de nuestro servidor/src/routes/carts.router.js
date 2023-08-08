import { Router } from "express";
import { createNewCart, addProductToCartId, getCartById, deleteProductFromCartById, updateProductsFromCartById, updateProductQuantityInCartById, deleteAllProductsFromCartById } from '../controllers/carts.controller.js';

const router = Router();

router.post('/', createNewCart);

router.post('/:cid/product/:pid', addProductToCartId);

router.get('/:cid', getCartById);

router.delete('/:cid/products/:pid', deleteProductFromCartById);

router.put('/:cid', updateProductsFromCartById);

router.put('/:cid/products/:pid', updateProductQuantityInCartById);

router.delete('/:cid', deleteAllProductsFromCartById);

export default router;

