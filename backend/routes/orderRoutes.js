const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

/* ================= CREATE ORDER ================= */
router.post('/', async (req, res) => {
  try {
    const {
      items,
      customer,
      paymentMethod,
      shippingAddress,
      paymentStatus,
      totalAmount,
      shippingCharge,
      finalAmount,
      razorpayData
    } = req.body;

    // ✅ VALIDATIONS
    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No items in order'
      });
    }

    if (!customer || !customer.name || !customer.phone) {
      return res.status(400).json({
        success: false,
        message: 'Customer details missing'
      });
    }

    if (!shippingAddress || !shippingAddress.city) {
      return res.status(400).json({
        success: false,
        message: 'Shipping address missing'
      });
    }

    // ✅ CREATE ORDER
    const order = new Order({
      items,
      customer,
      paymentMethod,
      shippingAddress,

      paymentStatus: paymentStatus || 'Pending',

      totalAmount,
      shippingCharge,
      finalAmount,

      razorpayDetails: razorpayData
        ? {
            orderId: razorpayData.razorpayOrderId,
            paymentId: razorpayData.razorpayPaymentId
          }
        : undefined
    });

    await order.save();

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      orderId: order._id
    });

  } catch (error) {
    console.error('❌ Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create order'
    });
  }
});

/* ================= GET ALL ORDERS ================= */
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      success: true,
      count: orders.length,
      orders
    });

  } catch (error) {
    console.error('❌ Fetch orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders'
    });
  }
});

/* ================= GET ORDER BY ID ================= */
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).lean();

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      order
    });

  } catch (error) {
    console.error('❌ Fetch order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order'
    });
  }
});

module.exports = router;