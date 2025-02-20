import React from "react";
import { Link } from "react-router-dom";
import "./PaymentStatus.css"; // ✅ Optional styling

const PaymentCancel = () => {
  return (
    <div className="payment-status-container">
      <h2>Payment Canceled</h2>
      <p>Your payment was not completed. Please try again.</p>
      <Link to="/GameSelect" className="btn btn-primary">Back to Games</Link>
    </div>
  );
};

export default PaymentCancel;
