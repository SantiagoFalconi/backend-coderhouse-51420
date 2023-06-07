import fs from 'fs';
import express from 'express';
import handlebars from 'express-handlebars';
import __dirname from './utils.js';
import productsRouter from './routes/products.js';
import cartsRouter from './routes/carts.js';
import viewsRouter from './routes/views.router.js';
import { Server } from 'socket.io';

const PORT = 8080;
const app = express();
const serverHttp = app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));
const io = new Server(serverHttp);

app.use(express.static(__dirname + '/public'));

app.engine('handlebars', handlebars.engine());
app.set('views',`${__dirname}/views`);
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/products',productsRouter);
app.use('/api/carts',cartsRouter);
app.use('/',viewsRouter);

async function readProductsFromFile() {
  try {
    const data = await fs.readFileSync('./src/products.json', 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.log(error);
    return [];
  }
}

io.on('connection', async (socket) => {
  console.log('Client connected');

  const products = await readProductsFromFile();
  socket.emit('productList', products);
})

