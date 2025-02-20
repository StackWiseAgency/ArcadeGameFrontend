import React from "react";
import { Link } from "react-router-dom";
import "./PaymentStatus.css"; // ✅ Optional styling

const SuccessPage = () => {
  return (
    <div className="payment-status-container">
      <h2>Payment Successful!</h2>
      <p>Thank you for your purchase. You can now enjoy your game.</p>
      <Link to="/GameSelect" className="btn btn-primary">Back to Games</Link>
    </div>
  );
};

export default SuccessPage;
