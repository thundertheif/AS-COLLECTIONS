const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },

    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price cannot be negative"],
    },

    category: {
      type: String,
      required: [true, "Category is required"],
      enum: {
        values: ["Tops", "Sarees", "Kurtis", "Designer Materials", "Sale"],
        message: "Invalid category",
      },
    },

    subCategory: {
      type: String,
      default: "",
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    image: {
      type: String,
      default: "/no-image.png",
    },

    images: [
      {
        type: String,
      },
    ],

    stock: {
      type: Number,
      required: true,
      min: [0, "Stock cannot be negative"],
      default: 0,
    },

    discount: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },

    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 4.5,
    },

    reviews: [
      {
        user: String,
        rating: {
          type: Number,
          min: 0,
          max: 5,
        },
        comment: String,
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    isActive: {
      type: Boolean,
      default: true,
    },

    featured: {
      type: Boolean,
      default: false,
    },

    sizes: [String],
    colors: [String],

    material: {
      type: String,
      default: "",
    },

    careInstructions: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// ✅ INDEXES
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ name: "text", description: "text" });

module.exports = mongoose.model("Product", productSchema);