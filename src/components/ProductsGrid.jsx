import React from "react";
import "../styles/ProductsGrid.css";

import top0 from "../assets/images/top0.jpg";
import top2 from "../assets/images/top2.jpg";
import top3 from "../assets/images/top3.jpg";
import top4 from "../assets/images/top4.jpg";

import kurti1 from "../assets/images/kurti1.jpg";
import kurti2 from "../assets/images/kurti2.jpg";

const products = [
  {
    id: 1,
    name: "Floral Printed Top",
    price: "₹999",
    image: top0,
    category: "Tops",
  },
  {
    id: 2,
    name: "Casual Cotton Top",
    price: "₹799",
    image: top2,
    category: "Tops",
  },
  {
    id: 3,
    name: "Designer Party Top",
    price: "₹1499",
    image: top3,
    category: "Tops",
  },
  {
    id: 4,
    name: "Summer White Top",
    price: "₹699",
    image: top4,
    category: "Tops",
  },
  {
    id: 5,
    name: "Floral Kurti",
    price: "₹1299",
    image: kurti1,
    category: "Kurti",
  },
  {
    id: 6,
    name: "Designer Kurti",
    price: "₹1599",
    image: kurti2,
    category: "Kurti",
  },
];

export default function ProductsGrid({ category }) {
  const filteredProducts = category
    ? products.filter((product) => product.category === category)
    : products;

  return (
    <div className="products-grid">
      {filteredProducts.map((product) => (
        <div className="product-card" key={product.id}>
          <img src={product.image} alt={product.name} className="product-image" />
          <h3>{product.name}</h3>
          <p className="product-price">{product.price}</p>
          <button className="add-btn">Add to Cart</button>
        </div>
      ))}
    </div>
  );
}
