const Product = require('../models/Product');
const AppError = require('../utils/AppError');

async function listProducts(query) {
  const page = Math.max(1, parseInt(query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 10));
  const skip = (page - 1) * limit;
  const filter = {};
  if (query.category) filter.category = query.category;
  if (query.search) filter.name = { $regex: query.search, $options: 'i' };

  const sortField = query.sort || '-createdAt';
  const sortOrder = sortField.startsWith('-') ? -1 : 1;
  const sortKey = sortField.replace(/^-/, '');

  const [products, total] = await Promise.all([
    Product.find(filter).skip(skip).limit(limit).sort({ [sortKey]: sortOrder }),
    Product.countDocuments(filter),
  ]);

  return {
    products,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  };
}

async function getProduct(id) {
  const product = await Product.findById(id);
  if (!product) throw new AppError('Product not found', 404);
  return product;
}

async function createProduct(data, userId) {
  return Product.create({ ...data, createdBy: userId });
}

async function updateProduct(id, data) {
  const product = await Product.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
  if (!product) throw new AppError('Product not found', 404);
  return product;
}

async function deleteProduct(id) {
  const product = await Product.findByIdAndDelete(id);
  if (!product) throw new AppError('Product not found', 404);
  return product;
}

module.exports = { listProducts, getProduct, createProduct, updateProduct, deleteProduct };
