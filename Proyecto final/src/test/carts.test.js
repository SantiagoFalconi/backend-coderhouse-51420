import app from '../app.js';
import chai from 'chai';
import supertest from 'supertest';

const expect = chai.expect;
const request = supertest('http://localhost:8080')


describe('Testing Carts', () => {
    let authToken; 
    before(async () => {
      // Realiza la autenticación y almacena el token en la variable authToken
      const authResponse = await request(app)
        .post('/api/auth/login')
        .send({ /* Datos de inicio de sesión válidos */ });
      authToken = authResponse.body.token;
    });

    describe('POST /api/carts', () => {
      it('You should create a new cart', async () => {
        const response = await request(app)
          .post('/api/carts')
          .set('Authorization', `Bearer ${authToken}`);
        expect(response.status).to.equal(201);
        expect(response.body).to.be.an('object');
      });
    });
  
    describe('POST /api/carts/:cid/product/:pid', () => {
      it('You should add a product to the cart', async () => {
        const cartId = 'existing_cart_id'; // Reemplazar con un ID válido
        const productId = 'product_id_to_add'; // Reemplazar con un ID válido
        const response = await request(app)
          .post(`/api/carts/${cartId}/product/${productId}`)
          .set('Authorization', `Bearer ${authToken}`);
        expect(response.status).to.equal(200);
        expect(response.body).to.deep.equal({ message: 'Product added to cart successfully' });
      });
  
      it('Should return an error if the cart or product does not exist', async () => {
        const cartId = 'nonexistent_cart_id'; // Reemplazar con un ID que no existe
        const productId = 'nonexistent_product_id'; // Reemplazar con un ID que no existe
        const response = await request(app)
          .post(`/api/carts/${cartId}/product/${productId}`)
          .set('Authorization', `Bearer ${authToken}`);
        expect(response.status).to.equal(404);
      });
    });
  
    describe('GET /api/carts/:cid', () => {
      it('You should get a cart by your ID', async () => {
        const cartId = 'existing_cart_id'; // Reemplazar con un ID válido
        const response = await request(app)
          .get(`/api/carts/${cartId}`)
          .set('Authorization', `Bearer ${authToken}`);
        expect(response.status).to.equal(200);
        expect(response.body).to.be.an('object');
      });
  
      it('Should return an error if the cart does not exist', async () => {
        const cartId = 'nonexistent_id'; // Reemplazar con un ID que no existe
        const response = await request(app)
          .get(`/api/carts/${cartId}`)
          .set('Authorization', `Bearer ${authToken}`);
        expect(response.status).to.equal(404);
      });
    });
});