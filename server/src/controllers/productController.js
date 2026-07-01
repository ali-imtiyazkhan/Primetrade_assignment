const productService = require('../services/productService');
const { sendSuccess } = require('../utils/apiResponse');

async function list(req, res, next) {
  try {
    const result = await productService.listProducts(req.query);
    sendSuccess(res, result);
  } catch (err) { next(err); }
}

async function getById(req, res, next) {
  try {
    const product = await productService.getProduct(req.params.id);
    sendSuccess(res, { product });
  } catch (err) { next(err); }
}

async function create(req, res, next) {
  try {
    const product = await productService.createProduct(req.body, req.user._id);
    sendSuccess(res, { product }, 'Product created successfully', 201);
  } catch (err) { next(err); }
}

async function update(req, res, next) {
  try {
    const product = await productService.updateProduct(req.params.id, req.body);
    sendSuccess(res, { product }, 'Product updated successfully');
  } catch (err) { next(err); }
}

async function remove(req, res, next) {
  try {
    await productService.deleteProduct(req.params.id);
    sendSuccess(res, null, 'Product deleted successfully');
  } catch (err) { next(err); }
}

module.exports = { list, getById, create, update, remove };
