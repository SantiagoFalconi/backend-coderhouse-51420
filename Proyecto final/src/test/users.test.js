import app from '../app.js';
import chai from 'chai';
import supertest from 'supertest';

const expect = chai.expect;
const request = supertest('http://localhost:8080')


describe('Testing Users', () => {
    describe('checkRole', () => {
      it('Should allow access if role matches', async () => {
        const response = await request(app).get('/dummy-route').set('Authorization', 'Bearer adminToken'); // Reemplazar con la ruta y token adecuados
        expect(response.status).to.equal(200);
      });
  
      it('Should deny access if role does not match', async () => {
        const response = await request(app).get('/dummy-route').set('Authorization', 'Bearer userToken'); // Reemplazar con la ruta y token adecuados
        expect(response.status).to.equal(403);
        expect(response.body).to.deep.equal({ status: 'error', error: 'Access denied' });
      });
    });
  
    describe('checkProductPermissions', () => {
      it('Should allow access if the user is admin', async () => {
        const response = await request(app).get('/dummy-route').set('Authorization', 'Bearer adminToken'); // Reemplazar con la ruta y token adecuados
        expect(response.status).to.equal(200);
      });
  
      it('Should allow access if the user is premium and owns the product', async () => {
        const response = await request(app).get('/dummy-route').set('Authorization', 'Bearer premiumToken'); // Reemplazar con la ruta y token adecuados
        expect(response.status).to.equal(200);
      });
  
      it('Should allow access if the user is premium and owns the product', async () => {
        const response = await request(app).get('/dummy-route').set('Authorization', 'Bearer userToken'); // Reemplazar con la ruta y token adecuados
        expect(response.status).to.equal(404);
        expect(response.body).to.deep.equal({ status: 'error', error: 'Product not found' });
      });
  
      it('Should deny access if the user is not admin or premium owner', async () => {
        const response = await request(app).get('/dummy-route').set('Authorization', 'Bearer userToken'); // Reemplazar con la ruta y token adecuadoss
        expect(response.status).to.equal(403);
        expect(response.body).to.deep.equal({ status: 'error', error: 'You do not have permission to perform this action' });
      });
    });

    describe('changeOfRol', () => {
      it('You should change the user role to premium', async () => {
        const response = await request(app).post('/dummy-route').set('Authorization', 'Bearer adminToken'); // Reemplazar con la ruta y token adecuados
        expect(response.status).to.equal(200);
        expect(response.body).to.deep.equal({ status: 'success', message: 'User role updated successfully' });
      });
  
      it('You should change the user role to user', async () => {
        const response = await request(app).post('/dummy-route').set('Authorization', 'Bearer userToken'); // Reemplazar con la ruta y token adecuados
        expect(response.status).to.equal(200);
        expect(response.body).to.deep.equal({ status: 'success', message: 'User role updated successfully' });
      });
  
      it('Should handle an error if the user does not exist', async () => {
        const response = await request(app).post('/dummy-route').set('Authorization', 'Bearer userToken'); // Reemplazar con la ruta y token adecuados
        expect(response.status).to.equal(404);
        expect(response.body).to.deep.equal({ status: 'error', error: 'User not found' });
      });
    });
});