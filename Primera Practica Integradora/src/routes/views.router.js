import { Router } from 'express';
import fs from 'fs';

const router = Router();

async function readProductsFromFile() {
  try {
    const data = await fs.readFileSync('./src/products.json', 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

router.get('/', async (req,res)=>{
  const products = await readProductsFromFile();
  res.render('home', { products: products });
});

router.get('/realtimeproducts', async (req, res) => {
  const products = await readProductsFromFile();
  res.render('realtimeproducts', { products: products });
});

router.get('/chat', async (req, res) => {
  res.render('chat', {})
})

export default router;