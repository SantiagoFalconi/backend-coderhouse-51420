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

async function getLastProductId() {
  try {
    const products = await readProductsFromFile();

    let lastId = 0;

    if (products.length > 0) {
      for (const product of products) {
        if (product.id && product.id > lastId) {
          lastId = product.id;
        }
      }
    }
    return lastId;
  } catch (error) {
    return 0;
  }
}

router.get('/', async (req, res) => {
  const products = await readProductsFromFile();
  res.send({status:"success",products});
});

router.get('/products', async (req, res) => {
  const limit = req.query.limit;
  const products = await readProductsFromFile();

  if (limit) {
    const limitedProducts = products.slice(0, limit);
    res.send({limitedProducts});
  } else {
    res.send({products});
  }
});
  
router.get('/:pid', async (req, res) => {
  const productId = req.params.pid;
  const products = await readProductsFromFile();
  const product = products.find(product => product.id === parseInt(productId));
  
  if (product) {
    res.send({product});
  } else {
    res.send('Product not found');
  }
});

router.post('/', async (req, res) => {
  
  const newProduct = {
    id: (await getLastProductId()) + 1,
    title: req.body.title,
    description: req.body.description,
    code: req.body.code,
    price: req.body.price,
    thumbnail : [],
    stock: req.body.stock,
    status: true,
    category: req.body.category,
  };

  const products = await readProductsFromFile();
  products.push(newProduct);
  await fs.promises.writeFile('products.json', JSON.stringify(products), 'utf-8');

  res.send({ status: 'Product added successfully', product: newProduct });
});

router.put('/:pid', async (req, res) => {
  const productId = req.params.pid;
  const updatedProduct = req.body;

  const products = await readProductsFromFile();
  const index = products.findIndex(product => product.id === parseInt(productId));

  if (index !== -1) {
    updatedProduct.id = products[index].id;
    products[index] = { ...products[index], ...updatedProduct };
    await fs.promises.writeFile('products.json', JSON.stringify(products), 'utf-8');

    res.send({ status: 'Product updated successfully', product: updatedProduct });
  } else {
    res.send({ status: 'Product not found' });
  }
});

router.delete('/:pid', async (req, res) => {
  const productId = req.params.pid;

  const products = await readProductsFromFile();
  const index = products.findIndex(product => product.id === parseInt(productId));

  if (index !== -1) {
    products.splice(index, 1);
    await fs.promises.writeFile('products.json', JSON.stringify(products), 'utf-8');
    res.send({ status: 'Product deleted successfully', products: products });
  } else {
    res.send({ status: 'Product not found' });
  }
});

export default router;


