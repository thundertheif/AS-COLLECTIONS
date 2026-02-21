import React from "react";
import ProductsGrid from "../components/ProductsGrid";
import "../styles/Tops.css";

export default function Tops() {
  return (  
    <div className="tops-page">
      
      {/* Page Header */}
      <div className="tops-header">
        <h1>Women's Tops</h1>
        <p>Explore our latest collection of stylish tops</p>
      </div>

      {/* Products Grid */}
      <div className="tops-products">
        <ProductsGrid category="Tops" />
      </div>

    </div>
  );
}
