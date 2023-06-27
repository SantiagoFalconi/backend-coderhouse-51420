import { Router } from 'express';
import fs from 'fs';

const router = Router();

async function readCartsFromFile() {
  try {
    const data = await fs.readFileSync('./src/carts.json', 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

async function getLastCartId() {
  try {
    const carts = await readCartsFromFile();

    let lastId = 0;

    if (carts.length > 0) {
      for (const cart of carts) {
        if (cart.id && cart.id > lastId) {
          lastId = cart.id;
        }
      }
    }
    return lastId;
  } catch (error) {
    return 0;
  }
}

async function updateCartWithProduct(cartId, productId) {
  try {
    const carts = await readCartsFromFile();
    const cart = carts.find(cart => cart.id === cartId);
    if (cart) {
      const existingProduct = cart.products.find((p) => p.product === productId);
      if (existingProduct) {
        existingProduct.quantity += 1;
      } else {
        cart.products.push({ product: productId, quantity: 1 });
      }
      await fs.promises.writeFile('carts.json', JSON.stringify(carts, null, 2), 'utf-8');
      return cart;
    }
  } catch (error) {
    throw error;
  }
}

router.post('/', async (req, res) => {

  const newCart = {
    id: (await getLastCartId()) + 1,
    products: [],
  };

  const carts = await readCartsFromFile();
  carts.push(newCart);
  await fs.promises.writeFile('carts.json', JSON.stringify(carts), 'utf-8');
  res.send({ status: 'Cart added successfully', payload: newCart });
});

router.get('/', async (req, res) => {
  const carts = await readCartsFromFile();
  res.send({status:"success",payload :carts});
});

router.get('/:cid', async (req, res) => {
  const cartId = req.params.cid;
  const carts = await readCartsFromFile();
  const cart = carts.find(cart => cart.id === parseInt(cartId));
  
  if (cart) {
    res.send({status:"success",payload :cart});
  } else {
    res.status(404).send('CartID not found');
  }
});

router.post('/:cid/product/:pid', (req, res) => {
  const cartId = parseInt(req.params.cid);
  const productId = parseInt(req.params.pid);

  updateCartWithProduct(cartId, productId)
    .then((updatedCart) => {
      if(updatedCart){
        res.send({status:'Product added to cart successfully', payload: updatedCart});
      } else {
        res.status(404).send('Cart not found');
      }

    })
    .catch((error) => {
      res.status(500).send('Error adding product to cart');
    });
});

export default router;

