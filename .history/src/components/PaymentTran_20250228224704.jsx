


import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { QRCodeCanvas } from "qrcode.react";
import CryptoJS from "crypto-js"; // Import CryptoJS for encryption
import "./PaymentTran.css";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);
const SECRET_KEY=process.env.React_APP_SECRET_KEY;

const PaymentTran = ({ selectedGame, onClose }) => {
  const navigate = useNavigate();

  const [clientSecret, setClientSecret] = useState(null);
  const [checkoutUrl, setCheckoutUrl] = useState("");
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const gameName = selectedGame?.name || "Unknown Game";
  const price = selectedGame?.numericPrice || 5.00;
  const amount = Math.round(price);

  // Get necessary user and game info from localStorage
  const playerName = localStorage.getItem("authUser")
    ? JSON.parse(localStorage.getItem("authUser")).name
    : "guest"; // Default to "guest" if no user info
  const userId = localStorage.getItem("authUser")
    ? JSON.parse(localStorage.getItem("authUser")).id
    : 0; // Default to 0 if no user info
  const gameId = selectedGame?.id || 0; // Get game ID from selectedGame prop

  // Encrypt data
  const encryptData = (data) => {
    const encryptedData = CryptoJS.AES.encrypt(
      JSON.stringify(data),
      SECRET_KEY // Replace with your actual secret key
    ).toString();
    return encryptedData;
  };

  // Generate success URL with encrypted data
  const generateSuccessUrl = (baseUrl, encryptedData) => {
    return `${baseUrl}/payment-success?data=${encryptedData}`;
  };

  // Fetch the checkout session
  useEffect(() => {
    const fetchCheckoutSession = async () => {
      const baseUrl = window.location.origin;

      // Prepare the data to be encrypted and sent via success URL
      const data = {
        playerName: playerName,
        gameName: gameName,
        highScore: 0, // Default to 0 if not provided
        userId: userId,
        gameId: gameId,
      };

      // Encrypt the data
      const encryptedData = encryptData(data);

      // Generate the success URL
      const successUrl = generateSuccessUrl(baseUrl, encryptedData);
      const cancelUrl = `${baseUrl}/payment-cancel`;

      try {
        const response = await fetch(
          "https://arcadegamebackendapi20241227164011.azurewebsites.net/api/payment/create-checkout-session",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              amount,
              currency: "usd",
              gameName,
              successUrl,
              cancelUrl,
              checkoutUrl: "" // This will be populated by backend
            }),
          }
        );

        const data = await response.json();
        if (data.checkoutUrl) {
          setClientSecret(data.id);
          setCheckoutUrl(data.checkoutUrl);
        } else {
          setErrorMessage("Error fetching checkout session.");
        }
      } catch (error) {
        setErrorMessage("Failed to fetch checkout session.");
      }
    };

    fetchCheckoutSession();
  }, [amount, gameName, playerName, userId, gameId]);

  const handleCheckout = async () => {
    const stripe = await stripePromise;

    if (!stripe || !clientSecret) {
      console.error("Stripe.js not loaded or clientSecret missing.");
      return;
    }

    const { error } = await stripe.redirectToCheckout({
      sessionId: clientSecret,
    });

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

        {checkoutUrl && (
          <div className="qr-container">
            <h3>Scan to Pay</h3><br />
            <QRCodeCanvas value={checkoutUrl} size={200} />
            <br /><br />
            <p>Or </p>

            <div className="button-group">
              <button
                onClick={() => window.open(checkoutUrl, "_self")}
                className="play-button"
              >
                Pay Now (USD {price.toFixed(2)}) on Stripe
              </button>

              <button onClick={onClose} className="close-button">
                Close
              </button>
            </div>
          </div>
        )}

        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </div>
    </div>
  );
};

export default PaymentTran;



// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { loadStripe } from "@stripe/stripe-js";
// import { QRCodeCanvas } from "qrcode.react";  
// import "./PaymentTran.css";

// const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY); 

// const PaymentTran = ({ selectedGame, onClose }) => {
//   const navigate = useNavigate();

//   const [clientSecret, setClientSecret] = useState(null); 
//   const [checkoutUrl, setCheckoutUrl] = useState(""); 
//   const [paymentStatus, setPaymentStatus] = useState(null); 
//   const [errorMessage, setErrorMessage] = useState(null); 


//   const gameName = selectedGame?.name || "Unknown Game";
//   const price = selectedGame?.numericPrice || 5.00;
//   const amount = Math.round(price ); 

  
//   useEffect(() => {
//     const fetchCheckoutSession = async () => {

//       const baseUrl = window.location.origin;

    
//       const successUrl = `${baseUrl}/payment-success`; 
//       const cancelUrl = `${baseUrl}/payment-cancel`; 

//       try {
//         const response = await fetch("https://arcadegamebackendapi20241227164011.azurewebsites.net/api/payment/create-checkout-session", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             amount,
//             currency: "usd",
//             gameName,
//             successUrl,
//             cancelUrl,
//             // successUrl: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.zeuxinnovation.com%2Farticles%2Fmaximising-user-satisfaction-the-psychology-behind-effective-payment-success-page-design%2F&psig=AOvVaw1Stpq_6ncYKIbKipl7Pznb&ust=1740121797111000&source=images&cd=vfe&opi=89978449&ved=0CBYQjRxqFwoTCIDGxIPZ0YsDFQAAAAAdAAAAABAE", // Replace with actual success URL
//             // cancelUrl: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.pinterest.com%2Fpin%2Fcancellation-page--543317142547079429%2F&psig=AOvVaw0XrBAP218psin1Ugl3kwuF&ust=1740121836797000&source=images&cd=vfe&opi=89978449&ved=0CBYQjRxqFwoTCICDyJfZ0YsDFQAAAAAdAAAAABAE", // Replace with actual cancel URL
//             checkoutUrl: "" // This will be populated by backend
//           }),
//         });

//         const data = await response.json();
//         if (data.checkoutUrl) {
//           setClientSecret(data.id); 
//           setCheckoutUrl(data.checkoutUrl); 
//         } else {
//           setErrorMessage("Error fetching checkout session.");
//         }
//       } catch (error) {
//         setErrorMessage("Failed to fetch checkout session.");
//       }
//     };

//     fetchCheckoutSession();
//   }, [amount, gameName]);


//   const handleCheckout = async () => {
//     const stripe = await stripePromise;

//     if (!stripe || !clientSecret) {
//       console.error("Stripe.js not loaded or clientSecret missing.");
//       return;
//     }

//     const { error } = await stripe.redirectToCheckout({ sessionId: clientSecret });

//     if (error) {
//       console.error("Error during Stripe Checkout redirect:", error);
//       setErrorMessage(error.message);
//     }
//   };

//   return (
//     <div className="payment-modal-container">
//       <div className="modal-overlay"></div>
//       <div className="payment-modal">
//         <h2>Pay for {gameName}</h2>
//         <p>Complete your payment to start playing.</p>

        
//         {checkoutUrl && (
//           <div className="qr-container">
//             <h3>Scan to Pay</h3><br />
//             <QRCodeCanvas value={checkoutUrl} size={200} /> 
//             <br /><br />
//             <p>Or </p>
            
//             <div className="button-group">
//             <button
//               onClick={() => window.open(checkoutUrl, "_self")}  
//               className="play-button"
//             >
//               Pay Now (USD {price.toFixed(2)}) on Stripe
//             </button>

//               <button onClick={onClose} className="close-button">Close</button>

//           </div>
//           </div>
          
//         )}

       
//         {errorMessage && <p className="error-message">{errorMessage}</p>}
//       </div>
//     </div>
//   );
// };

// export default PaymentTran;
