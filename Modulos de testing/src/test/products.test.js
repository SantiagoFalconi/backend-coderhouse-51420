import app from '../app.js';
import chai from 'chai';
import supertest from 'supertest';

const expect = chai.expect;
const request = supertest('http://localhost:8080')

describe('Testing Products', () => {
    describe('GET /api/products', () => {
      it('You should get a list of products', async () => {
        const response = await request(app).get('/api/products');
        expect(response.status).to.equal(200);
        expect(response.body).to.be.an('array');
      });
    });
  
    describe('GET /api/products/:pid', () => {
      it('You should get a product by its ID', async () => {
        const productId = 'product_id_to_get'; // Reemplazar con un ID válido
        const response = await request(app).get(`/api/products/${productId}`);
        expect(response.status).to.equal(200);
        expect(response.body).to.be.an('object');
      });
  
      it('Should return an error if the product does not exist', async () => {
        const productId = 'nonexistent_id'; // Reemplazar con un ID que no existe
        const response = await request(app).get(`/api/products/${productId}`);
        expect(response.status).to.equal(404);
      });
    });
  
    describe('PUT /api/products/:pid', () => {
      it('Should you update a product by its ID', async () => {
        const productId = 'product_id_to_update'; // Reemplazar con un ID válido
        const updatedProduct = { /* Datos actualizados del producto */ };
        const response = await request(app)
          .put(`/api/products/${productId}`)
          .send(updatedProduct);
        expect(response.status).to.equal(200);
        expect(response.body).to.deep.equal({ message: 'Product updated successfully' });
      });
  
      it('Should return an error if the product does not exist', async () => {
        const productId = 'nonexistent_id'; // Reemplazar con un ID que no existe
        const updatedProduct = { /* Datos actualizados del producto */ };
        const response = await request(app)
          .put(`/api/products/${productId}`)
          .send(updatedProduct);
        expect(response.status).to.equal(404);
      });
    });
  
    describe('POST /api/products', () => {
      it('Should add a new product', async () => {
        const newProduct = { /* Datos del nuevo producto */ };
        const response = await request(app)
          .post('/api/products')
          .send(newProduct);
        expect(response.status).to.equal(201);
        expect(response.body).to.be.an('object');
      });
    });
  
    describe('DELETE /api/products/:pid', () => {
      it('Should you delete a product by its ID', async () => {
        const productId = 'product_id_to_delete'; // Reemplazar con un ID válido
        const response = await request(app).delete(`/api/products/${productId}`);
        expect(response.status).to.equal(200);
        expect(response.body).to.deep.equal({ message: 'Product successfully removed' });
      });
  
      it('Should return an error if the product does not exist', async () => {
        const productId = 'nonexistent_id'; // Reemplazar con un ID que no existe
        const response = await request(app).delete(`/api/products/${productId}`);
        expect(response.status).to.equal(404);
      });
    });
});