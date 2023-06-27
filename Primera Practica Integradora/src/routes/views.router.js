import { Router } from 'express';
import fs from 'fs';
import messegesModel from "../dao/models/messages.js";

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
  res.render('realtimeproducts', {});
});

router.get('/chat', async (req, res) => {
  try {
    const messages = await messegesModel.find();
    res.render('chat', { messages });
  } catch (err) {
    res.status(500).send('Error al recuperar los mensajes');
  }
});

router.post('/chat', async (req, res) => {
  const newMessage = new messegesModel({
    user: req.body.user,
    message: req.body.message
  });

  try {
    await newMessage.save();
    res.redirect('/chat');
  } catch (err) {
    res.status(500).send('Error al guardar el mensaje');
  }
});

export default router;