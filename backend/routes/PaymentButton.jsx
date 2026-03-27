import { useState } from "react";
import axios from "axios";

const PaymentButton = ({ amount, cartItems, customer }) => {

  const [paymentMethod, setPaymentMethod] = useState("upi");

  const handlePayment = async () => {
    try {

      // ✅ HANDLE COD SEPARATELY
      if (paymentMethod === "cod") {
        await axios.post("http://localhost:5000/api/orders", {
          items: cartItems,
          customer,
          totalAmount: amount,
          paymentMethod: "COD",
          paymentStatus: "Pending"
        });

        alert("Order placed with Cash on Delivery ✅");
        return;
      }

      // ✅ 1. Create order
      const { data: order } = await axios.post(
        "http://localhost:5000/api/payment/create-order",
        {
          amount,
          products: cartItems,
          customer,
        }
      );

      // ✅ 2. Razorpay options
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: order.amount,
        currency: "INR",
        name: "AS Collections",
        description: "Order Payment",
        order_id: order.id,

        // ✅ CONTROL METHODS BASED ON USER SELECTION
        method: {
          upi: paymentMethod === "upi",
          card: paymentMethod === "card",
          netbanking: paymentMethod === "netbanking",
          wallet: paymentMethod === "wallet"
        },

        // ✅ SUCCESS
        handler: async function (response) {
          try {

            const verifyRes = await axios.post(
              "http://localhost:5000/api/payment/verify-payment",
              response
            );

            if (!verifyRes.data.success) {
              alert("Payment verification failed");
              return;
            }

            await axios.post("http://localhost:5000/api/orders", {
              items: cartItems,
              customer,
              totalAmount: amount,
              paymentMethod: "ONLINE",
              paymentStatus: "Paid",
              razorpayDetails: {
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id
              }
            });

            alert("Payment Successful ✅");

          } catch (err) {
            console.error(err);
            alert("Verification failed");
          }
        },

        modal: {
          ondismiss: function () {
            alert("Payment Cancelled ❌");
          }
        },

        prefill: {
          name: customer?.name || "",
          email: customer?.email || "",
          contact: customer?.phone || ""
        },

        theme: {
          color: "#e91e63"
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch (err) {
      console.error(err);
      alert("Payment failed");
    }
  };

  return (
    <div>

      {/* ✅ PAYMENT OPTIONS UI */}
      <div className="payment-methods">

        <h3>Choose Payment Method</h3>

        <label>
          <input
            type="radio"
            value="upi"
            checked={paymentMethod === "upi"}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
          UPI (GPay / PhonePe / Paytm)
        </label>

        <label>
          <input
            type="radio"
            value="card"
            checked={paymentMethod === "card"}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
          Credit / Debit Card
        </label>

        <label>
          <input
            type="radio"
            value="netbanking"
            checked={paymentMethod === "netbanking"}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
          Net Banking
        </label>

        <label>
          <input
            type="radio"
            value="wallet"
            checked={paymentMethod === "wallet"}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
          Wallets (Paytm / Mobikwik)
        </label>

        <label>
          <input
            type="radio"
            value="cod"
            checked={paymentMethod === "cod"}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
          Cash on Delivery
        </label>

      </div>

      {/* ✅ PAY BUTTON */}
      <button className="payment-btn" onClick={handlePayment}>
        Pay ₹{amount}
      </button>

    </div>
  );
};

export default PaymentButton;
