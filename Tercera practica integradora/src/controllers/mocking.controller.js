import { generateProduct } from '../const/generateProduct.js';

export const mockingproducts = (req, res) => {
    const { limit = 100 } = req.query;

    const products = [];
    for (let i = 0; i < limit; i++) {
        products.push(generateProduct());
    }

    res.status(200).json({ status: 'success', data: products });
}