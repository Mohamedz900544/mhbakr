
import express from 'express';
import { getProducts, createProduct, createOrder, getMyOrders } from '../controllers/shopController.js';

const router = express.Router();

router.get('/products', getProducts);
router.post('/products', createProduct);
router.post('/orders', createOrder);
router.get('/orders', getMyOrders);

export default router;
