import fs from 'fs';
import express from 'express';
import handlebars from 'express-handlebars';
import __dirname from './utils.js';
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import viewsRouter from './routes/views.router.js';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import { messageDBManager } from "./dao/managers/messagesDBManager.js";

const PORT = 8080;
const app = express();
const MONGO = 'mongodb+srv://sfalconi:geccia@cluster0.j9zkkpu.mongodb.net/?retryWrites=true&w=majority';
const serverMongo = app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));
export const io = new Server(serverMongo)
const connection = mongoose.connect(MONGO);

const messagesDBMgr = new messageDBManager();

app.use(express.static(__dirname+'/public'));

app.engine('handlebars', handlebars.engine());
app.set('views',`${__dirname}/views`);
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/products',productsRouter);
app.use('/api/carts',cartsRouter);
app.use('/',viewsRouter);

io.on('connection', async (socket) => {

  socket.on('message', async (data) => {
    socket.emit('')
    await messagesDBMgr.addMessage(data)
    const messages = await messagesDBMgr.getMessages()
    io.emit('messageLogs', messages)
})

  socket.on('authenticated', data => {
    socket.broadcast.emit('newUserConnected', data);
  })
})

