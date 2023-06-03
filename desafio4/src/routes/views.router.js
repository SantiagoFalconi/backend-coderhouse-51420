import { Router } from 'express';
import fs from 'fs';

const router = Router();

async function readProductsFromFile() {
  try {
    const data = await fs.readFileSync('products.json', 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

router.get('/', async (req,res)=>{
  const products = await readProductsFromFile();
  res.render('index', { products: products });
});

router.get('/realtimeproducts', (req,res)=>{
    res.render('realtimeproducts');
});

export default router;