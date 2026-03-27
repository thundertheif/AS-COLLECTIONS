// backend/routes/products.js

const express = require("express");
const router = express.Router();
const mongoose = require("mongoose"); // ✅ FIXED (added)
const Product = require("../models/Product");


// =====================================================
// GET PRODUCTS WITH FILTERS
// =====================================================
router.get("/", async (req, res) => {
  try {
    const { 
      category, 
      subCategory, 
      minPrice, 
      maxPrice, 
      inStock, 
      search,
      sortBy = "createdAt",
      order = "desc",
      page = 1,
      limit = 12
    } = req.query;

    // ✅ FIXED: removed isActive dependency (safe query)
    const query = {};

    // ✅ Filters
    if (category) {
      query.category = { $regex: `^${category}$`, $options: "i" };
    }

    if (subCategory) {
      query.subCategory = { $regex: subCategory, $options: "i" };
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (inStock === "true") {
      query.stock = { $gt: 0 }; // ✅ FIXED (better logic)
    }

    // ✅ FIXED: replaced $text with regex search
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    const sortOption = { [sortBy]: order === "desc" ? -1 : 1 };
    const skip = (Number(page) - 1) * Number(limit);

    const [products, total] = await Promise.all([
      Product.find(query)
        .sort(sortOption)
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      Product.countDocuments(query)
    ]);

    res.json({
      success: true,
      data: products,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / limit),
        limit: Number(limit)
      }
    });

  } catch (error) {
    console.error("❌ Fetch products error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error while fetching products"
    });
  }
});


// =====================================================
// GET SINGLE PRODUCT BY ID OR SLUG
// =====================================================
router.get("/:idOrSlug", async (req, res) => {
  try {
    const { idOrSlug } = req.params;

    let query;

    // ✅ FIXED: mongoose import used safely
    if (mongoose.Types.ObjectId.isValid(idOrSlug)) {
      query = { _id: idOrSlug };
    } else {
      query = { slug: idOrSlug };
    }

    const product = await Product.findOne(query).lean();

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    res.json({
      success: true,
      data: product
    });

  } catch (error) {
    console.error("❌ Fetch single product error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Error fetching product"
    });
  }
});

module.exports = router;