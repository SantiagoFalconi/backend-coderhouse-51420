import { Router } from "express";
import { createNewCart, addProductToCartId, getCartById, deleteProductFromCartById, updateProductsFromCartById, updateProductQuantityInCartById, deleteAllProductsFromCartById, finalizePurchase } from '../controllers/carts.controller.js';
import { checkRole } from '../config/passport.config.js';

const router = Router();

router.post('/', createNewCart);

router.post('/:cid/product/:pid', addProductToCartId, checkRole('user'));

router.get('/:cid', getCartById);

router.delete('/:cid/products/:pid', deleteProductFromCartById);

router.put('/:cid', updateProductsFromCartById);

router.put('/:cid/products/:pid', updateProductQuantityInCartById);

router.delete('/:cid', deleteAllProductsFromCartById);

router.post('/:cid/purchase', finalizePurchase )

export default router;

