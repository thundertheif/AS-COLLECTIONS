// backend/routes/productRoutes.js

const express = require("express");
const router = express.Router();
const Product = require("../models/Product");


// =====================================================
// GET ALL PRODUCTS (FILTER + PAGINATION)
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

    // ✅ FIXED: removed isActive dependency
    const query = {};

    // ✅ Category (case-insensitive)
    if (category) {
      query.category = { $regex: `^${category}$`, $options: "i" };
    }

    // ✅ Subcategory
    if (subCategory) {
      query.subCategory = { $regex: subCategory, $options: "i" };
    }

    // ✅ Price filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // ✅ Stock filter
    if (inStock === "true") {
      query.stock = { $gt: 0 };
    }

    // ✅ Search
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    const sortOption = { [sortBy]: order === "desc" ? -1 : 1 };

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.max(1, parseInt(limit));
    const skip = (pageNum - 1) * limitNum;

    const [products, total] = await Promise.all([
      Product.find(query)
        .sort(sortOption)
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Product.countDocuments(query)
    ]);

    res.json({
      success: true,
      count: products.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      products
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
// GET PRODUCTS COUNT
// =====================================================
router.get("/count", async (req, res) => {
  try {
    const count = await Product.countDocuments({}); // ✅ FIXED

    res.json({
      success: true,
      count
    });

  } catch (error) {
    console.error("❌ Count error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Error counting products"
    });
  }
});


// =====================================================
// GET PRODUCTS BY CATEGORY
// =====================================================
router.get("/category/:cat", async (req, res) => {
  try {
    const categoryMap = {
      tops: "Tops",
      sarees: "Sarees",
      kurtis: "Kurtis",
      sale: "Sale",
      "designer-materials": "Designer Materials"
    };

    const key = String(req.params.cat || "").trim().toLowerCase();
    const category = categoryMap[key];

    if (!category) {
      return res.json({
        success: true,
        count: 0,
        products: []
      });
    }

    const products = await Product.find({
      category: category // ✅ FIXED (removed isActive)
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: products.length,
      products
    });

  } catch (error) {
    console.error("❌ Category error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error"
    });
  }
});


// =====================================================
// SEARCH PRODUCTS
// =====================================================
router.get("/search/:query", async (req, res) => {
  try {
    const q = String(req.params.query).trim();

    const products = await Product.find({
      name: { $regex: q, $options: "i" } // ✅ FIXED
    })
      .limit(20)
      .lean();

    res.json({
      success: true,
      count: products.length,
      products
    });

  } catch (error) {
    console.error("❌ Search error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Search failed"
    });
  }
});


// =====================================================
// GET SINGLE PRODUCT BY ID
// =====================================================
router.get("/:id", async (req, res) => {
  try {

    const product = await Product.findById(req.params.id).lean();

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    res.json({
      success: true,
      product
    });

  } catch (error) {
    console.error("❌ Fetch single product error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Error fetching product"
    });
  }
});


// =====================================================
// CREATE PRODUCT
// =====================================================
router.post("/", async (req, res) => {
  try {

    const product = new Product(req.body);
    await product.save();

    res.status(201).json({
      success: true,
      product
    });

  } catch (error) {
    console.error("❌ Create product error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Error creating product"
    });
  }
});


// =====================================================
// UPDATE PRODUCT
// =====================================================
router.put("/:id", async (req, res) => {
  try {

    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    res.json({
      success: true,
      product: updated
    });

  } catch (error) {
    console.error("❌ Update product error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Error updating product"
    });
  }
});


// =====================================================
// DELETE PRODUCT (SOFT DELETE OPTIONAL)
// =====================================================
router.delete("/:id", async (req, res) => {
  try {

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    // ✅ You can enable this if schema supports it
    // product.isActive = false;
    // await product.save();

    // ✅ Hard delete (safe fallback)
    await Product.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Product deleted successfully"
    });

  } catch (error) {
    console.error("❌ Delete product error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Error deleting product"
    });
  }
});

module.exports = router;