const mongoose = require("mongoose");
const Product = require("./models/Product");
require("dotenv").config();

// 🔹 COPY YOUR WomenProducts DATA HERE
const products = [
  {
    name: "Red Banarasi Silk Saree",
    category: "Saree",
    price: 1999,
    image: "/images/sarees/saree1.jpg"
  },
  {
    name: "Blue Kanchipuram Silk Saree",
    category: "Saree",
    price: 2499,
    image: "/images/sarees/saree2.jpg"
  },
  {
    name: "Green Cotton Saree",
    category: "Saree",
    price: 1299,
    image: "/images/sarees/saree3.jpg"
  },
  {
    name: "Black Party Top",
    category: "Top",
    price: 599,
    image: "/images/tops/top1.jpg"
  },
  {
    name: "Yellow Anarkali Kurti",
    category: "Kurti",
    price: 999,
    image: "/images/kurtis/kurti1.jpg"
  }
];

// Mongo Connect
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("✅ Mongo Connected");

    // Clear old products
    await Product.deleteMany();
    console.log("🗑 Old products deleted");

    // Insert new products
    await Product.insertMany(products);
    console.log("🎉 Products Uploaded Successfully");

    process.exit();
  })
  .catch(err => {
    console.log("❌ Error:", err);
    process.exit(1);
  });