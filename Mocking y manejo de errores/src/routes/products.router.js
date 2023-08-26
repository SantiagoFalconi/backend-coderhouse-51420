import { Router } from "express";
import { getProductsWithFilter, getProductsById, updateProductById, addNewProduct, deleteProductById } from '../controllers/products.controller.js';
import { checkRole } from '../config/passport.config.js';
import { generateProduct } from '../utils/generateProduct.js';

const router = Router();

router.get('/', getProductsWithFilter);

router.get('/:pid', getProductsById);

router.put('/:pid', updateProductById , checkRole('admin'));

router.post('/', addNewProduct, checkRole('admin'));

router.delete('/:pid', deleteProductById, checkRole('admin'));

router.get('/mockingproducts', (req, res) => {
    const { limit = 100 } = req.query;

    const products = [];
    for (let i = 0; i < limit; i++) {
        products.push(generateProduct());
    }

    res.status(200).json({ status: 'success', data: products });
});

export default router;
