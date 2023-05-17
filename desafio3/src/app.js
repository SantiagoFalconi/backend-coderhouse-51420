import express from 'express';
import fs from 'fs';

const app = express();

const PORT = 8080;

async function readProductsFromFile() {
  try {
    const data = await fs.readFileSync('products.json', 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading products file:', error);
    return [];
  }
}

app.get('/products', async (req, res) => {
    const limit = req.query.limit;
    const products = await readProductsFromFile();
  
    if (limit) {
      const limitedProducts = products.slice(0, limit);
      res.send({limitedProducts});
    } else {
      res.send({products});
    }
  });

app.get('/products/:pid', async (req, res) => {
  const productId = req.params.pid;
  const products = await readProductsFromFile();
  const product = products.find(product => product.id === parseInt(productId));

  if (product) {
    res.send({product});
  } else {
    res.send('Product not found');
  }
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
}); 


