
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { QRCodeCanvas } from "qrcode.react";  // Import QRCodeCanvas
import "./PaymentTran.css";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY); // Replace with your Stripe public key

const PaymentTran = ({ selectedGame }) => {
  const navigate = useNavigate();

  const [clientSecret, setClientSecret] = useState(null); // Store clientSecret received from the backend
  const [checkoutUrl, setCheckoutUrl] = useState(""); // Store the URL for the QR code
  const [paymentStatus, setPaymentStatus] = useState(null); // Store the payment status
  const [errorMessage, setErrorMessage] = useState(null); // Store any error messages

  // Game details from the selectedGame prop
  const gameName = selectedGame?.name || "Unknown Game";
  const price = selectedGame?.numericPrice || 5.00;
  const amount = Math.round(price ); // Convert to cents (Stripe uses cents)

  // Fetch the Checkout session from the backend when the component mounts
  useEffect(() => {
    const fetchCheckoutSession = async () => {
      try {
        const response = await fetch("https://arcadegamebackendapi20241227164011.azurewebsites.net/api/payment/create-checkout-session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount,
            currency: "usd",
            gameName,
            successUrl: "https://yourdomain.com/success", // Replace with actual success URL
            cancelUrl: "https://yourdomain.com/cancel", // Replace with actual cancel URL
            checkoutUrl: "" // This will be populated by backend
          }),
        });

        const data = await response.json();
        if (data.checkoutUrl) {
          setClientSecret(data.id); // Set the session ID
          setCheckoutUrl(data.checkoutUrl); // Set the checkout URL for QR code
        } else {
          setErrorMessage("Error fetching checkout session.");
        }
      } catch (error) {
        setErrorMessage("Failed to fetch checkout session.");
      }
    };

    fetchCheckoutSession();
  }, [amount, gameName]);

  // Handle the Checkout process (when user clicks Pay Now)
  const handleCheckout = async () => {
    const stripe = await stripePromise;

    if (!stripe || !clientSecret) {
      console.error("Stripe.js not loaded or clientSecret missing.");
      return;
    }

    const { error } = await stripe.redirectToCheckout({ sessionId: clientSecret });

    if (error) {
      console.error("Error during Stripe Checkout redirect:", error);
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="payment-modal-container">
      <div className="modal-overlay"></div>
      <div className="payment-modal">
        <h2>Pay for {gameName}</h2>
        <p>Complete your payment to start playing.</p>

        {/* Display the QR code */}
        {checkoutUrl && (
          <div className="qr-container">
            <h3>Scan to Pay</h3>
            <QRCodeCanvas value={checkoutUrl} size={200} /> {/* Generate QR Code */}
            <p>Or </p>
            {/* <p>Or <a href={checkoutUrl} target="_blank" rel="noopener noreferrer">Click Here</a> to pay (USD {price.toFixed(2)}) on Stripe.</p> */}
            <div className="button-group">
              <button
                onClick={() => window.open(checkoutUrl, "_blank")}
                className="btn-primary"
              >
                Pay Now (USD {price.toFixed(2)}) on Stripe
              </button>
          </div>
          </div>
          
        )}

        {/* Payment Form Button */}
        {/* <div className="button-group">
          <button
            onClick={handleCheckout}
            className="btn-primary"
            disabled={!clientSecret} // Disable button until sessionId is available
          >
            Pay Now (USD {price.toFixed(2)})
          </button>
        </div> */}

        {/* Error Message */}
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </div>
    </div>
  );
};

export default PaymentTran;


// import React from "react";
// import { useNavigate } from "react-router-dom";
// import "./PaymentTran.css";

// const PaymentTran = ({ selectedGame }) => {
//   const navigate = useNavigate();

//   const redirectToCheckout = () => {
//     navigate(`/checkout?gameName=${selectedGame?.name}&price=${selectedGame?.numericPrice}`);
//   };

//   return (
//     <div className="payment-modal-container">
//       <div className="modal-overlay"></div>
//       <div className="payment-modal">
//         {/* <img
//           src={PaymentMachineCard}
//           alt="Payment Machine"
//           className="payment-machine-image"
//         /> */}

//         <h2>Pay for {selectedGame?.name || "Your Game"}</h2>
//         <p>Complete your payment to start playing.</p>

//         <button onClick={redirectToCheckout} className="play-button">
//           Proceed to Checkout
//         </button>
//       </div>
//     </div>
//   );
 
// };

// export default PaymentTran;



// import React, { useState } from "react";
// import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
// import { QRCodeCanvas } from "qrcode.react";
// import "./PaymentTran.css";
// import PaymentMachineCard from "../assets/payment-machine-plus-card.png"; // ✅ Keep your original image

// const PaymentTran = ({ selectedGame, onClose }) => {
//   const stripe = useStripe();
//   const elements = useElements();
//   const [paymentStatus, setPaymentStatus] = useState("idle"); // "idle", "loading", "success", "error"
//   const [checkoutUrl, setCheckoutUrl] = useState(null);
//   const [errorMessage, setErrorMessage] = useState(null);

//   // ✅ Handle Direct Card Payment (Stripe Elements)
//   const handleCardPayment = async () => {
//     if (!stripe || !elements) return;
//     setPaymentStatus("loading");

//     const amount = selectedGame?.numericPrice * 100 || 0;
//     console.log(`Processing Card Payment for: $${selectedGame.numericPrice}`);

//     try {
//       const response = await fetch("http://localhost:5000/create-payment-intent", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ amount, currency: "usd" }),
//       });

//       const { clientSecret } = await response.json();
//       console.log("Received Stripe Client Secret:", clientSecret);

//       const result = await stripe.confirmCardPayment(clientSecret, {
//         payment_method: { card: elements.getElement(CardElement) },
//       });

//       setPaymentStatus(result.error ? "error" : "success");
//       if (result.error) setErrorMessage(result.error.message);
//     } catch (error) {
//       console.error("Payment error:", error);
//       setPaymentStatus("error");
//     }
//   };

//   // ✅ Generate Stripe Checkout QR Code
//   const generateCheckoutQR = async () => {
//     setPaymentStatus("loading");
//     const amount = selectedGame?.numericPrice * 100 || 0;
//     console.log(`Generating QR for: $${selectedGame.numericPrice}`);

//     try {
//       const response = await fetch("http://localhost:5000/create-checkout-session", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ amount, currency: "usd", gameName: selectedGame.name }),
//       });

//       const { url } = await response.json();
//       console.log("Checkout URL:", url);
//       setCheckoutUrl(url);
//       setPaymentStatus("qrReady");
//     } catch (error) {
//       console.error("QR Code error:", error);
//       setPaymentStatus("error");
//     }
//   };

//   return (
//     <div className="payment-modal-container">
//       <div className="modal-overlay"></div>
//       <div className="payment-modal">
//         <img src={PaymentMachineCard} alt="Payment Machine" className="payment-machine-image" /> {/* ✅ Keep original image */}

//         {/* Show Payment Options */}
//         {paymentStatus === "idle" && (
//           <>
//             <div className="play-content">  
//               <h2>Tap 'Play' to Start Your Adventure!</h2>
//               <p>
//                 Please proceed to the POS machine to complete your payment and unlock the game. 
//                 Get ready for fun!
//               </p>
//             </div>

//             <div className="card-input-container">
//               <CardElement options={{ hidePostalCode: true }} />
//             </div>

//             <div className="button-group"> {/* ✅ Maintain Button Styling */}
//               <button onClick={handleCardPayment} className="play-button">
//                 Pay Now (${selectedGame?.numericPrice || "0.00"})
//               </button>

//               <button onClick={generateCheckoutQR} className="qr-button">
//                 Get QR Code for Mobile Payment
//               </button>
//             </div>
//           </>
//         )}

//         {/* Show QR Code Payment Option */}
//         {paymentStatus === "qrReady" && checkoutUrl && (
//           <div className="qr-container">
//             <h3>Scan to Pay</h3>
//             <QRCodeCanvas value={checkoutUrl} size={200} />
//             <p>Or <a href={checkoutUrl} target="_blank" rel="noopener noreferrer">Click Here</a> to pay.</p>
//           </div>
//         )}

//         {/* Show Loading Animation */}
//         {paymentStatus === "loading" && (
//           <div className="spinner-container">
//             <div className="spinner white-spinner"></div>
//           </div>
//         )}

//         {/* Show Payment Success Message */}
//         {paymentStatus === "success" && (
//           <>
//             <h2>Payment Successfully Completed!</h2>
//             <p>You're all set — proceed to the game and enjoy!</p>
//             <div className="spinner-container">
//               <div className="spinner green-spinner"></div>
//               <div className="tick-mark"></div>
//             </div>
//             <button onClick={onClose} className="continue-button">
//               Continue
//             </button>
//           </>
//         )}

//         {/* Show Payment Error */}
//         {paymentStatus === "error" && (
//           <>
//             <h2>Payment Failed</h2>
//             <p>{errorMessage || "Please try again."}</p>
//             <button onClick={handleCardPayment} className="retry-button">
//               Retry Payment
//             </button>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default PaymentTran;


// import React, { useState } from "react";
// import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
// import QRCode from "qrcode.react";
// import "./PaymentTran.css";

// const PaymentTran = ({ selectedGame, onClose }) => {
//   const stripe = useStripe();
//   const elements = useElements();
//   const [paymentStatus, setPaymentStatus] = useState("idle"); // "idle", "loading", "success", "error"
//   const [checkoutUrl, setCheckoutUrl] = useState(null);
//   const [errorMessage, setErrorMessage] = useState(null);

//   // ✅ Handle Direct Card Payment (Stripe Elements)
//   const handleCardPayment = async () => {
//     if (!stripe || !elements) {
//       console.error("Stripe is not loaded yet.");
//       return;
//     }

//     setPaymentStatus("loading");

//     try {
//       const response = await fetch("http://localhost:5000/create-payment-intent", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           amount: selectedGame.numericPrice * 100, // Convert to cents
//           currency: "usd",
//         }),
//       });

//       const { clientSecret } = await response.json();

//       const result = await stripe.confirmCardPayment(clientSecret, {
//         payment_method: { card: elements.getElement(CardElement) },
//       });

//       if (result.error) {
//         setErrorMessage(result.error.message);
//         setPaymentStatus("error");
//       } else if (result.paymentIntent.status === "succeeded") {
//         setPaymentStatus("success");
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
//           amount: selectedGame.numericPrice * 100,
//           currency: "usd",
//           gameName: selectedGame.name,
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
//     <div className="payment-modal-container">
//       <h2>Pay for {selectedGame?.name || "Your Game"}</h2>

//       {/* Stripe Elements Payment Form */}
//       {paymentStatus === "idle" && (
//         <>
//           <div className="card-input-container">
//             <CardElement options={{ hidePostalCode: true }} />
//           </div>

//           <button onClick={handleCardPayment} className="play-button">
//             Pay Now (${selectedGame?.numericPrice || "0.00"})
//           </button>

//           <button onClick={generateCheckoutQR} className="qr-button">
//             Get QR Code for Mobile Payment
//           </button>
//         </>
//       )}

//       {/* QR Code Display */}
//       {paymentStatus === "qrReady" && checkoutUrl && (
//         <div className="qr-container">
//           <h3>Scan to Pay</h3>
//           <QRCode value={checkoutUrl} size={200} />
//           <p>Or <a href={checkoutUrl} target="_blank" rel="noopener noreferrer">Click Here</a> to pay.</p>
//         </div>
//       )}

//       {/* Payment Success */}
//       {paymentStatus === "success" && (
//         <>
//           <h2>Payment Successful!</h2>
//           <p>You're all set. Enjoy your game!</p>
//           <button onClick={onClose} className="continue-button">
//             Continue
//           </button>
//         </>
//       )}

//       {/* Payment Error */}
//       {paymentStatus === "error" && (
//         <>
//           <h2>Payment Failed</h2>
//           <p>{errorMessage || "Please try again."}</p>
//           <button onClick={handleCardPayment} className="retry-button">
//             Retry Payment
//           </button>
//         </>
//       )}
//     </div>
//   );
// };

// export default PaymentTran;

// import React, { useState } from "react";
// import "./PaymentTran.css";
// import PaymentMachineCard from "../assets/payment-machine-plus-card.png";

// const PaymentTran = ({ selectedGame, onClose }) => {
//   const [paymentStatus, setPaymentStatus] = useState("idle"); // "idle", "loading", "success", "error"

//   const handlePayment = () => {
//     setPaymentStatus("loading"); // Show spinner

//     setTimeout(() => {
//       const success = Math.random() > 0.1; // Simulate 90% success rate
//       if (success) {
//         setPaymentStatus("success");
//       } else {
//         setPaymentStatus("error");
//       }
//     }, 1000);
//   };

//   return (
//     <div className="payment-modal-container">
//       <div className="modal-overlay"></div>
//       <div className="payment-modal">
//         <img
//           src={PaymentMachineCard}
//           alt="Payment Machine"
//           className="payment-machine-image"
//         />

//         {paymentStatus === "idle" && (
//           <>
//             <div className="play-content">
//               <h2>Tap 'Play' to Start {selectedGame?.name || "Your Game"}!</h2>
//               <p>
//                 Please proceed to the POS machine to complete your payment and unlock the game.
//                 Get ready for fun!
//               </p>
//             </div>
//             <div className="spinner-container">
//               <div className="spinner white-spinner"></div>
//             </div>
//             <button onClick={handlePayment} className="play-button">
//               Play
//             </button>
//           </>
//         )}

//         {paymentStatus === "loading" && (
//           <>
//             <h2>Processing Payment...</h2>
//             <div className="spinner-container">
//               <div className="spinner white-spinner"></div>
//             </div>
//           </>
//         )}

//         {paymentStatus === "success" && (
//           <>
//             <h2>Payment Successfully Completed!</h2>
//             <p>You're all set — proceed to the game and enjoy!</p>
//             <div className="spinner-container">
//               <div className="tick-mark"></div>
//             </div>
//             <button onClick={onClose} className="continue-button">
//               Continue
//             </button>
//           </>
//         )}

//         {paymentStatus === "error" && (
//           <>
//             <h2>Payment Failed</h2>
//             <p>Please try again.</p>
//             <div className="spinner-container">
//               <p className="error-message">Transaction could not be completed.</p>
//             </div>
//             <button onClick={handlePayment} className="retry-button">
//               Retry Payment
//             </button>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default PaymentTran;


// import React, { useState } from "react";
// import "./PaymentTran.css";
// import PaymentMachineCard from "../assets/payment-machine-plus-card.png";

// const PaymentTran = ({ selectedGame, onClose }) => {
//   const [paymentStatus, setPaymentStatus] = useState(false);

//   const handlePayment = () => {
//     setTimeout(() => {
//       setPaymentStatus(true); // Change to success state
//     }, 1000); // Simulate a 1-second delay
//   };

//   return (
//     <div className="payment-modal-container">
//       <div className="modal-overlay"></div>
//       <div className="payment-modal">
//         <img
//           src={PaymentMachineCard}
//           alt="Payment Machine"
//           className="payment-machine-image"
//         />

//         {!paymentStatus ? (
//           <>
//             <div className="play-content">  
//               <h2>Tap 'Play' to Start Your Adventure!</h2>
//               <p>
//                 Please proceed to the POS machine to complete your payment and
//                 unlock the game. Get ready for fun!
//               </p>
//             </div>  
//             <div className="spinner-container">
//               <div className="spinner white-spinner"></div>
//             </div>
//             <button onClick={handlePayment} className="play-button">
//               Play
//             </button>
//           </>
//         ) : (
//           <>
//             <h2>Payment Successfully Completed!</h2>
//             <p>You're all set — proceed to the game and enjoy!</p>
//             <div className="spinner-container">
//               <div className="spinner green-spinner"></div>
//               <div className="tick-mark"></div>
//             </div>
//             <button onClick={onClose} className="continue-button">
//               Continue
//             </button>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default PaymentTran;

// copy 
// import React, { useState } from "react";
// import "./PaymentTran.css";
// import PaymentMachineCard from "../assets/payment-machine-plus-card.png";

// const PaymentTran = ({ selectedGame, onClose }) => {
//   const [paymentStatus, setPaymentStatus] = useState(false);

//   const handlePayment = () => {
//     setTimeout(() => {
//       setPaymentStatus(true); // Change to success state
//     }, 1000); // Simulate a 1-second delay
//   };

//   return (
//     <div className="payment-modal-container">
//       <div className="modal-overlay"></div>
//       <div className="payment-modal">
//         <img
//           src={PaymentMachineCard}
//           alt="Payment Machine"
//           className="payment-machine-image"
//         />

//         {!paymentStatus ? (
//           <>
//             <div className="play-content">  
//               <h2>Tap 'Play' to Start Your Adventure!</h2>
//               <p>
//                 Please proceed to the POS machine to complete your payment and
//                 unlock the game. Get ready for fun!
//               </p>
//             </div>  
//             <div className="spinner-container">
//               <div className="spinner white-spinner"></div>
//             </div>
//             <button onClick={handlePayment} className="play-button">
//               Play
//             </button>
//           </>
//         ) : (
//           <>
//             <h2>Payment Successfully Completed!</h2>
//             <p>You're all set — proceed to the game and enjoy!</p>
//             <div className="spinner-container">
//               <div className="spinner green-spinner"></div>
//               <div className="tick-mark"></div>
//             </div>
//             <button onClick={onClose} className="continue-button">
//               Continue
//             </button>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default PaymentTran;

