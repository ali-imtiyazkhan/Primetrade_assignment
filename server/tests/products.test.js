require('dotenv').config({ path: '.env.test' });
const mongoose = require('mongoose');
const request = require('supertest');
const express = require('express');
const authRoutes = require('../src/routes/auth');
const productRoutes = require('../src/routes/products');
const errorHandler = require('../src/middleware/errorHandler');

const app = express();
app.use(express.json());
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/products', productRoutes);
app.use(errorHandler);

let adminToken;
let userToken;

beforeAll(async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/primetrade_test';
  await mongoose.connect(uri);

  const adminRes = await request(app)
    .post('/api/v1/auth/register')
    .send({ name: 'Admin', email: 'admin@test.com', password: 'admin123', role: 'admin' });
  adminToken = adminRes.body.data.accessToken;

  const userRes = await request(app)
    .post('/api/v1/auth/register')
    .send({ name: 'User', email: 'user@test.com', password: 'user123', role: 'user' });
  userToken = userRes.body.data.accessToken;
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

describe('Products API', () => {
  let productId;

  describe('POST /api/v1/products', () => {
    it('should create product as admin', async () => {
      const res = await request(app)
        .post('/api/v1/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'Test Product', price: 29.99 });
      expect(res.status).toBe(201);
      productId = res.body.data.product._id;
    });

    it('should reject creation by non-admin', async () => {
      const res = await request(app)
        .post('/api/v1/products')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ name: 'Test', price: 10 });
      expect(res.status).toBe(403);
    });

    it('should reject unauthenticated creation', async () => {
      const res = await request(app)
        .post('/api/v1/products')
        .send({ name: 'Test', price: 10 });
      expect(res.status).toBe(401);
    });

    it('should reject missing name', async () => {
      const res = await request(app)
        .post('/api/v1/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ price: 10 });
      expect(res.status).toBe(400);
    });
  });

  describe('GET /api/v1/products', () => {
    it('should list products', async () => {
      const res = await request(app)
        .get('/api/v1/products')
        .set('Authorization', `Bearer ${userToken}`);
      expect(res.status).toBe(200);
      expect(res.body.data.products).toBeInstanceOf(Array);
      expect(res.body.data.pagination).toBeDefined();
    });

    it('should reject unauthenticated access', async () => {
      const res = await request(app).get('/api/v1/products');
      expect(res.status).toBe(401);
    });
  });

  describe('PUT /api/v1/products/:id', () => {
    it('should update product as admin', async () => {
      const res = await request(app)
        .put(`/api/v1/products/${productId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ price: 19.99 });
      expect(res.status).toBe(200);
      expect(res.body.data.product.price).toBe(19.99);
    });

    it('should reject update by non-admin', async () => {
      const res = await request(app)
        .put(`/api/v1/products/${productId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ price: 5 });
      expect(res.status).toBe(403);
    });
  });

  describe('DELETE /api/v1/products/:id', () => {
    it('should delete product as admin', async () => {
      const res = await request(app)
        .delete(`/api/v1/products/${productId}`)
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.status).toBe(200);
    });

    it('should return 404 for deleted product', async () => {
      const res = await request(app)
        .get(`/api/v1/products/${productId}`)
        .set('Authorization', `Bearer ${userToken}`);
      expect(res.status).toBe(404);
    });
  });
});
