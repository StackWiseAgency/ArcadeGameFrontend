
import React, { useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { QRCodeCanvas } from "qrcode.react";
import { useLocation, useNavigate } from "react-router-dom";
import "./CheckoutPage.css";

const CheckoutPage = () => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [cardholderName, setCardholderName] = useState("");
  const [currency, setCurrency] = useState("usd"); // ✅ Allow user to select currency
  const [billingAddress, setBillingAddress] = useState({
    country: "Pakistan",
    addressLine1: "",
    addressLine2: "",
    suburb: "",
    city: "",
    postalCode: "",
  });

  const [paymentStatus, setPaymentStatus] = useState("idle");
  const [checkoutUrl, setCheckoutUrl] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  // ✅ Get Game Price from URL Params
  const queryParams = new URLSearchParams(location.search);
  const gameName = queryParams.get("gameName") || "Unknown Game";
  const price = parseFloat(queryParams.get("price")) || 5.00;

  // ✅ Fixing Amount Conversion Based on Currency
  const currencyUsesCents = ["usd", "eur", "gbp", "pkr"]; // Currencies that use cents
  const amount = currencyUsesCents.includes(currency.toLowerCase()) ? price * 100 : price;

  // ✅ Handle Stripe Card Payment (Elements)
  const handleCardPayment = async () => {
    if (!stripe || !elements) return;
    setPaymentStatus("loading");

    try {
      const response = await fetch("https://arcadegamebackendapi20241227164011.azurewebsites.net/api/payment/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          currency,
          email,
          cardholderName,
          billingAddress,
        }),
      });

      const { clientSecret } = await response.json();
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: cardholderName,
            email: email,
            address: {
              country: billingAddress.country,
              line1: billingAddress.addressLine1,
              line2: billingAddress.addressLine2,
              city: billingAddress.city,
              postal_code: billingAddress.postalCode,
            },
          },
        },
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
      const response = await fetch("https://arcadegamebackendapi20241227164011.azurewebsites.net/api/payment/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, currency, gameName }),
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
      <p>Price: {currency.toUpperCase()} {price.toFixed(2)}</p>

      {/* ✅ Currency Selection */}
      <div className="form-group">
        <label>Select Currency</label>
        <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
          <option value="usd">USD ($)</option>
          <option value="eur">EUR (€)</option>
          <option value="gbp">GBP (£)</option>
          <option value="pkr">PKR (₨)</option>
          <option value="jpy">JPY (¥)</option>
        </select>
      </div>

      {/* ✅ Email Input */}
      <div className="form-group">
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      {/* ✅ Card Information */}
      <div className="form-group">
        <label>Card Information</label>
        <div className="card-input-container">
          <CardElement options={{ hidePostalCode: true }} />
        </div>
      </div>

      {/* ✅ Cardholder Name */}
      <div className="form-group">
        <label>Cardholder Name</label>
        <input
          type="text"
          value={cardholderName}
          onChange={(e) => setCardholderName(e.target.value)}
          required
        />
      </div>

      {/* ✅ Billing Address */}
      <div className="form-group">
        <label>Billing Address</label>
        <input
          type="text"
          placeholder="Address Line 1"
          value={billingAddress.addressLine1}
          onChange={(e) =>
            setBillingAddress({ ...billingAddress, addressLine1: e.target.value })
          }
          required
        />
        <input
          type="text"
          placeholder="Address Line 2"
          value={billingAddress.addressLine2}
          onChange={(e) =>
            setBillingAddress({ ...billingAddress, addressLine2: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="City"
          value={billingAddress.city}
          onChange={(e) =>
            setBillingAddress({ ...billingAddress, city: e.target.value })
          }
          required
        />
        <input
          type="text"
          placeholder="Postal Code"
          value={billingAddress.postalCode}
          onChange={(e) =>
            setBillingAddress({ ...billingAddress, postalCode: e.target.value })
          }
          required
        />
      </div>

      {/* ✅ Pay & QR Buttons */}
      <div className="button-group">
        <button onClick={handleCardPayment} className="btn btn-primary">
          Pay Now ({currency.toUpperCase()} {price.toFixed(2)})
        </button>

        <button onClick={generateCheckoutQR} className="qr-button">
          Get QR Code for Mobile Payment
        </button>
      </div>

      {/* ✅ QR Code Display */}
      {paymentStatus === "qrReady" && checkoutUrl && (
        <div className="qr-container">
          <h3>Scan to Pay</h3>
          <QRCodeCanvas value={checkoutUrl} size={200} />
          <p>Or <a href={checkoutUrl} target="_blank" rel="noopener noreferrer">Click Here</a> to pay.</p>
        </div>
      )}

      {/* ✅ Payment Error */}
      {paymentStatus === "error" && <p className="error-message">{errorMessage}</p>}
    </div>
  );
};

export default CheckoutPage;


// import React, { useState } from "react";
// import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
// import { QRCodeCanvas } from "qrcode.react";
// import { useLocation, useNavigate } from "react-router-dom";
// import "./CheckoutPage.css";

// const CheckoutPage = () => {
//   const stripe = useStripe();
//   const elements = useElements();
//   const navigate = useNavigate();
//   const location = useLocation();

//   const [email, setEmail] = useState("");
//   const [cardholderName, setCardholderName] = useState("");
//   const [billingAddress, setBillingAddress] = useState({
//     country: "Pakistan",
//     addressLine1: "",
//     addressLine2: "",
//     suburb: "",
//     city: "",
//     postalCode: "",
//   });

//   const [paymentStatus, setPaymentStatus] = useState("idle");
//   const [checkoutUrl, setCheckoutUrl] = useState(null);
//   const [errorMessage, setErrorMessage] = useState(null);

//   // ✅ Get Game Price from URL Params
//   const queryParams = new URLSearchParams(location.search);
//   const gameName = queryParams.get("gameName") || "Unknown Game";
//   const price = parseFloat(queryParams.get("price")) || 5.00;
//   const amount = price * 100; // Convert to cents for Stripe

//   // ✅ Handle Stripe Card Payment (Elements)
//   const handleCardPayment = async () => {
//     if (!stripe || !elements) return;
//     setPaymentStatus("loading");

//     try {
//       const response = await fetch("https://arcadegamebackendapi20241227164011.azurewebsites.net/api/payment/create-payment-intent", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           amount,
//           currency: "usd",
//           email,
//           cardholderName,
//           billingAddress,
//         }),
//       });

//       const { clientSecret } = await response.json();
//       const result = await stripe.confirmCardPayment(clientSecret, {
//         payment_method: {
//           card: elements.getElement(CardElement),
//           billing_details: {
//             name: cardholderName,
//             email: email,
//             address: {
//               country: billingAddress.country,
//               line1: billingAddress.addressLine1,
//               line2: billingAddress.addressLine2,
//               city: billingAddress.city,
//               postal_code: billingAddress.postalCode,
//             },
//           },
//         },
//       });

//       if (result.error) {
//         setErrorMessage(result.error.message);
//         setPaymentStatus("error");
//       } else if (result.paymentIntent.status === "succeeded") {
//         navigate("/success");
//       }
//     } catch (error) {
//       console.error("Payment error:", error);
//       setPaymentStatus("error");
//     }
//   };

//   // ✅ Generate Stripe Checkout QR Code
//   const generateCheckoutQR = async () => {
//     setPaymentStatus("loading");

//     try {
//       const response = await fetch("https://arcadegamebackendapi20241227164011.azurewebsites.net/api/payment/create-checkout-session", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ amount, currency: "usd", gameName }),
//       });

//       const { url } = await response.json();
//       setCheckoutUrl(url);
//       setPaymentStatus("qrReady");
//     } catch (error) {
//       console.error("QR Code error:", error);
//       setPaymentStatus("error");
//     }
//   };

//   return (
//     <div className="checkout-container">
//       <h2>Complete Payment for {gameName}</h2>
//       <p>Price: ${price.toFixed(2)}</p>

//       {/* ✅ Email Input */}
//       <div className="form-group">
//         <label>Email</label>
//         <input
//           type="email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//         />
//       </div>

//       {/* ✅ Card Information */}
//       <div className="form-group">
//         <label>Card Information</label>
//         <div className="card-input-container">
//           <CardElement options={{ hidePostalCode: true }} />
//         </div>
//       </div>

//       {/* ✅ Cardholder Name */}
//       <div className="form-group">
//         <label>Cardholder Name</label>
//         <input
//           type="text"
//           value={cardholderName}
//           onChange={(e) => setCardholderName(e.target.value)}
//           required
//         />
//       </div>

//       {/* ✅ Billing Address */}
//       <div className="form-group">
//         <label>Billing Address</label>
//         <select
//           value={billingAddress.country}
//           onChange={(e) =>
//             setBillingAddress({ ...billingAddress, country: e.target.value })
//           }
//         >
//           <option value="Pakistan">Pakistan</option>
//           <option value="USA">USA</option>
//           <option value="UK">UK</option>
//         </select>
//         <input
//           type="text"
//           placeholder="Address Line 1"
//           value={billingAddress.addressLine1}
//           onChange={(e) =>
//             setBillingAddress({ ...billingAddress, addressLine1: e.target.value })
//           }
//           required
//         />
//         <input
//           type="text"
//           placeholder="Address Line 2"
//           value={billingAddress.addressLine2}
//           onChange={(e) =>
//             setBillingAddress({ ...billingAddress, addressLine2: e.target.value })
//           }
//         />
//         <input
//           type="text"
//           placeholder="Suburb"
//           value={billingAddress.suburb}
//           onChange={(e) =>
//             setBillingAddress({ ...billingAddress, suburb: e.target.value })
//           }
//         />
//         <input
//           type="text"
//           placeholder="City"
//           value={billingAddress.city}
//           onChange={(e) =>
//             setBillingAddress({ ...billingAddress, city: e.target.value })
//           }
//           required
//         />
//         <input
//           type="text"
//           placeholder="Postal Code"
//           value={billingAddress.postalCode}
//           onChange={(e) =>
//             setBillingAddress({ ...billingAddress, postalCode: e.target.value })
//           }
//           required
//         />
//       </div>

//       {/* ✅ Pay & QR Buttons */}
//       <div className="button-group">
//         <button onClick={handleCardPayment} className="btn btn-primary">
//           Pay Now (${price.toFixed(2)})
//         </button>

//         <button onClick={generateCheckoutQR} className="qr-button">
//           Get QR Code for Mobile Payment
//         </button>
//       </div>

//       {/* ✅ QR Code Display */}
//       {paymentStatus === "qrReady" && checkoutUrl && (
//         <div className="qr-container">
//           <h3>Scan to Pay</h3>
//           <QRCodeCanvas value={checkoutUrl} size={200} />
//           <p>Or <a href={checkoutUrl} target="_blank" rel="noopener noreferrer">Click Here</a> to pay.</p>
//         </div>
//       )}

//       {/* ✅ Payment Error */}
//       {paymentStatus === "error" && <p className="error-message">{errorMessage}</p>}
//     </div>
//   );
// };

// export default CheckoutPage;


// import React, { useState, useEffect } from "react";
// import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
// import { QRCodeCanvas } from "qrcode.react"; // ✅ QR Code Import
// import { useLocation, useNavigate } from "react-router-dom"; // ✅ For Redirects
// import "./CheckoutPage.css";

// const CheckoutPage = () => {
//   const stripe = useStripe();
//   const elements = useElements();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [paymentStatus, setPaymentStatus] = useState("idle");
//   const [checkoutUrl, setCheckoutUrl] = useState(null);
//   const [errorMessage, setErrorMessage] = useState(null);
  
//   // ✅ Get Game Price from URL Params or Default
//   const queryParams = new URLSearchParams(location.search);
//   const gameName = queryParams.get("gameName") || "Unknown Game";
//   const price = parseFloat(queryParams.get("price")) || 5.00; // Default: $5.00
//   const amount = price * 100; // Convert to cents for Stripe

//   // ✅ Handle Stripe Card Payment (Elements)
//   const handleCardPayment = async () => {
//     if (!stripe || !elements) return;
//     setPaymentStatus("loading");

//     try {
//       const response = await fetch("http://localhost:5000/create-payment-intent", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ amount, currency: "usd" }),
//       });

//       const { clientSecret } = await response.json();
//       const result = await stripe.confirmCardPayment(clientSecret, {
//         payment_method: { card: elements.getElement(CardElement) },
//       });

//       if (result.error) {
//         setErrorMessage(result.error.message);
//         setPaymentStatus("error");
//       } else if (result.paymentIntent.status === "succeeded") {
//         navigate("/success");
//       }
//     } catch (error) {
//       console.error("Payment error:", error);
//       setPaymentStatus("error");
//     }
//   };

//   // ✅ Generate Stripe Checkout QR Code
//   const generateCheckoutQR = async () => {
//     setPaymentStatus("loading");

//     try {
//       const response = await fetch("http://localhost:5000/create-checkout-session", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           amount,
//           currency: "usd",
//           gameName,
//         }),
//       });

//       const { url } = await response.json();
//       setCheckoutUrl(url);
//       setPaymentStatus("qrReady");
//     } catch (error) {
//       console.error("QR Code error:", error);
//       setPaymentStatus("error");
//     }
//   };

//   return (
//     <div className="checkout-container">
//       <h2>Complete Payment for {gameName}</h2>
//       <p>Price: ${price.toFixed(2)}</p>

//       {/* Stripe Card Payment */}
//       <div className="card-input-container">
//         <CardElement options={{ hidePostalCode: true }} />
//       </div>

//       <div className="button-group">
//         <button onClick={handleCardPayment} className="btn btn-primary">
//           Pay Now (${price.toFixed(2)})
//         </button>

//         <button onClick={generateCheckoutQR} className="qr-button">
//           Get QR Code for Mobile Payment
//         </button>
//       </div>

//       {/* QR Code Display */}
//       {paymentStatus === "qrReady" && checkoutUrl && (
//         <div className="qr-container">
//           <h3>Scan to Pay</h3>
//           <QRCodeCanvas value={checkoutUrl} size={200} />
//           <p>Or <a href={checkoutUrl} target="_blank" rel="noopener noreferrer">Click Here</a> to pay.</p>
//         </div>
//       )}

//       {/* Payment Error */}
//       {paymentStatus === "error" && <p className="error-message">{errorMessage}</p>}
//     </div>
//   );
// };

// export default CheckoutPage;
