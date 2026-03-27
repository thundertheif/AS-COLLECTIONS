const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const createOrder = async (amount) => {
  const response = await fetch(`${API}/api/orders/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount })
  });
  return await response.json();
};

export const verifyPayment = async (paymentData) => {
  const response = await fetch(`${API}/api/orders/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(paymentData)
  });
  return await response.json();
};

export const loadRazorpay = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};