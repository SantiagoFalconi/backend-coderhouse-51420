import express from 'express';
import displayRoutes from "express-routemap";
import handlebars from 'express-handlebars';
import __dirname from './utils.js';
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import viewsRouter from './routes/views.router.js';
import usersRouter from './routes/users.router.js';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import { messageDBManager } from "./services/db/dao/managers/messagesDBManager.js";
import sensitiveInfo from "./config/sensitiveInfo.js";
import passport from 'passport';
import initializePassport from "./config/passport.config.js";
import errorHandler from './const/middlewaresError/errorHandler.js';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUIExpress from 'swagger-ui-express';
// import MongoStore from 'connect-mongo';
// import session from 'express-session';


const PORT = 8080;
const app = express();
const { DB_USER, DB_PASSWORD, DB_HOST, DB_NAME } = sensitiveInfo; 
const MONGO = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}`;
const serverMongo = app.listen(PORT, () => { 
  displayRoutes(app);
  console.log(`Server is listening on port ${PORT}`);
});
const connection = mongoose.connect(MONGO,{
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.use(express.static(__dirname+'/public'));
app.use(errorHandler);

app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');
app.set('views',`${__dirname}/views`);


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/',viewsRouter);
app.use('/api/products',productsRouter);
app.use('/api/carts',cartsRouter);
app.use('/api/users', usersRouter);

initializePassport();
app.use(passport.initialize());

export const io = new Server(serverMongo);
const messagesDBMgr = new messageDBManager();

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

// config de swagger
const swaggerOptions = {
  definition: {
      openapi: '3.0.1',
      info: {
          title: 'Documentacion API Adopme',
          description: 'Documentacion para uso de swagger!!'
      }
  },
  apis: [`./src/docs/**/*.yaml`]
}

const specs = swaggerJSDoc(swaggerOptions);
app.use('/apidocs', swaggerUIExpress.serve, swaggerUIExpress.setup(specs));

export default app;

/*app.use(session({
  store: new MongoStore({
      mongoUrl: 'mongodb+srv://sfalconi:geccia@cluster0.j9zkkpu.mongodb.net/ecommerce',
      ttl: 3600
  }),
  secret: "GecciaSecret",
  resave: false,
  saveUninitialized: false
}))
*/




