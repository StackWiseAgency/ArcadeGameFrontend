import React, { useState, useEffect } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { QRCodeCanvas } from "qrcode.react"; // ✅ QR Code Import
import { useLocation, useNavigate } from "react-router-dom"; // ✅ For Redirects
import "./CheckoutPage.css";

const CheckoutPage = () => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const location = useLocation();
  const [paymentStatus, setPaymentStatus] = useState("idle");
  const [checkoutUrl, setCheckoutUrl] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  
  // ✅ Get Game Price from URL Params or Default
  const queryParams = new URLSearchParams(location.search);
  const gameName = queryParams.get("gameName") || "Unknown Game";
  const price = parseFloat(queryParams.get("price")) || 5.00; // Default: $5.00
  const amount = price * 100; // Convert to cents for Stripe

  // ✅ Handle Stripe Card Payment (Elements)
  const handleCardPayment = async () => {
    if (!stripe || !elements) return;
    setPaymentStatus("loading");

    try {
      const response = await fetch("http://localhost:5000/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, currency: "usd" }),
      });

      const { clientSecret } = await response.json();
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: elements.getElement(CardElement) },
      });

      if (result.error) {
        setErrorMessage(result.error.message);
        setPaymentStatus("error");
      } else if (result.paymentIntent.status === "succeeded") {
        navigate("/success");
      }
    } catch (error) {
      console.error("Payment error:", error);
      setPaymentStatus("error");
    }
  };

  // ✅ Generate Stripe Checkout QR Code
  const generateCheckoutQR = async () => {
    setPaymentStatus("loading");

    try {
      const response = await fetch("http://localhost:5000/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          currency: "usd",
          gameName,
        }),
      });

      const { url } = await response.json();
      setCheckoutUrl(url);
      setPaymentStatus("qrReady");
    } catch (error) {
      console.error("QR Code error:", error);
      setPaymentStatus("error");
    }
  };

  return (
    <div className="checkout-container">
      <h2>Complete Payment for {gameName}</h2>
      <p>Price: ${price.toFixed(2)}</p>

      {/* Stripe Card Payment */}
      <div className="card-input-container">
        <CardElement options={{ hidePostalCode: true }} />
      </div>

      <div className="button-group">
        <button onClick={handleCardPayment} className="btn btn-primary">
          Pay Now (${price.toFixed(2)})
        </button>

        <button onClick={generateCheckoutQR} className="qr-button">
          Get QR Code for Mobile Payment
        </button>
      </div>

      {/* QR Code Display */}
      {paymentStatus === "qrReady" && checkoutUrl && (
        <div className="qr-container">
          <h3>Scan to Pay</h3>
          <QRCodeCanvas value={checkoutUrl} size={200} />
          <p>Or <a href={checkoutUrl} target="_blank" rel="noopener noreferrer">Click Here</a> to pay.</p>
        </div>
      )}

      {/* Payment Error */}
      {paymentStatus === "error" && <p className="error-message">{errorMessage}</p>}
    </div>
  );
};

export default CheckoutPage;
