const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({

  // ✅ ORDER ITEMS
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: false
      },
      name: {
        type: String,
        required: true,
        trim: true
      },
      price: {
        type: Number,
        required: true,
        min: 0
      },
      quantity: {
        type: Number,
        required: true,
        min: 1
      },
      image: {
        type: String,
        default: "/no-image.png"
      }
    }
  ],

  // ✅ CUSTOMER DETAILS
  customer: {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      default: ""
    },
    phone: {
      type: String,
      required: true
    }
  },

  // ✅ SHIPPING ADDRESS (MATCHES ROUTE)
  shippingAddress: {
    address: { type: String, default: "" },   // ✅ matches route
    city: { type: String, required: true },
    state: { type: String, default: "" },
    pincode: { type: String, default: "" },
    country: { type: String, default: "India" }
  },

  // ✅ PAYMENT
  paymentMethod: {
    type: String,
    enum: ['COD', 'ONLINE'],
    default: 'COD'
  },

  paymentStatus: {
    type: String,
    enum: ['Pending', 'Paid', 'Failed'],
    default: 'Pending'
  },

  // ✅ AMOUNTS
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },

  shippingCharge: {
    type: Number,
    default: 0
  },

  finalAmount: {
    type: Number,
    required: true,
    min: 0
  },

  // ✅ RAZORPAY DETAILS (SAFE)
  razorpayDetails: {
    orderId: { type: String, default: "" },
    paymentId: { type: String, default: "" }
  },

  // ✅ ORDER STATUS
  status: {
    type: String,
    enum: ['Placed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Placed'
  }

}, {
  timestamps: true
});

// ✅ INDEX FOR PERFORMANCE
orderSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Order', orderSchema);