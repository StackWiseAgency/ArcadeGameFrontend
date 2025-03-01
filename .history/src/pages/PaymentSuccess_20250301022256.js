


import React, { useEffect, useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import CryptoJS from "crypto-js"; // Assuming you are using CryptoJS for encryption/decryption
import "./PaymentSuccess.css";

const SECRET_KEY=process.env.React_APP_SECRET_KEY;
const ADD_toQueue_API=process.env.React_APP_ADD_toQueue_API;

const PaymentSuccess = () => {
  const [paymentData, setPaymentData] = useState(null); // To hold the decrypted data
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const hasFetchedData = useRef(false);

  const location = useLocation();

  const decryptData = (encryptedData) => {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY); // Replace with your actual secret key
      const originalData = bytes.toString(CryptoJS.enc.Utf8);

      // Check if the decrypted data is valid
      if (!originalData) {
        throw new Error("Decrypted data is empty");
      }

      return JSON.parse(originalData); // Assuming the decrypted data is JSON
    } catch (error) {
      console.error("Error decrypting data:", error);
      throw new Error("Failed to decrypt data");
    }
  };

  // Use effect to get encrypted data from the URL and call API
  useEffect(() => {
    if (hasFetchedData.current) return; 

    const params = new URLSearchParams(location.search);
    let encryptedData = params.get("data");

    encryptedData = encryptedData.replace(/ /g, '+');

    console.log("Encrypted Data from URL: ", encryptedData); 

    if (encryptedData) {
      try {
        // Decrypt the encrypted data
        const decryptedData = decryptData(encryptedData);
        setPaymentData(decryptedData);
        console.log("Decrypted Payment Data: ", decryptedData);

        // Call the API to add to the queue
        handleAddToQueue(decryptedData);
        hasFetchedData.current = true;
      } catch (error) {
        console.error("Error decrypting data", error);
        setError("Failed to process payment data.");
      }
    }
  }, [location]);

  // Function to call the Add to Queue API
  const handleAddToQueue = async (data) => {
    setLoading(true);

    // Set default values for missing fields
    const playerName = data.playerName || "guest"; // Default to "guest" if missing
    const highScore = data.highScore || 0; // Default to 0 if missing
    const userId = data.userId || null; // Default to null if missing
    const gameName = data.gameName || ""; // Handle missing gameName gracefully
    const gameId = data.gameId || null; // Handle missing gameId gracefully

    try {
      const response = await axios.post(ADD_toQueue_API, {
        playerName,
        gameName,
        highScore,
        userId,
        gameId,
      });

      if (response.status === 200) {
        console.log("Successfully added to queue");
      } else {
        setError("Failed to add to queue.");
      }
    } catch (error) {
      setError("API call failed. Please try again.");
      console.error("Error adding to queue:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment-status-container-success">
      <h2>Payment Successful!</h2>
      <p>Thank you for your purchase. You can now enjoy your game.</p>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <Link to="/GameSelect" className="btn btn-primary">Back to Games</Link>
      )}
    </div>
  );
};

export default PaymentSuccess;



// import React, { useEffect, useState } from "react";
// import { Link, useLocation } from "react-router-dom";
// import axios from "axios";
// import CryptoJS from "crypto-js"; // Assuming you are using CryptoJS for encryption/decryption
// import "./PaymentSuccess.css";

// const PaymentSuccess = () => {
//   const [paymentData, setPaymentData] = useState(null); // To hold the decrypted data
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const location = useLocation();

//   // Function to decrypt the data
//   const decryptData = (encryptedData) => {
//     const bytes = CryptoJS.AES.decrypt(encryptedData, 'your-secret-key'); // Replace with your actual secret key
//     const originalData = bytes.toString(CryptoJS.enc.Utf8);
//     return JSON.parse(originalData); // Assuming the decrypted data is JSON
//   };

//   // Use effect to get encrypted data from the URL and call API
//   useEffect(() => {
//     const params = new URLSearchParams(location.search);
//     const encryptedData = params.get("data");

//     if (encryptedData) {
//       try {
//         // Decrypt the encrypted data
//         const decryptedData = decryptData(encryptedData);
//         setPaymentData(decryptedData);
//         console.log("Decrypted Payment Data: ", decryptedData);

//         // Call the API to add to the queue
//         handleAddToQueue(decryptedData);
//       } catch (error) {
//         console.error("Error decrypting data", error);
//         setError("Failed to process payment data.");
//       }
//     }
//   }, [location]);

//   // Function to call the Add to Queue API
//   const handleAddToQueue = async (data) => {
//     setLoading(true);

//     try {
//       const response = await axios.post('/api/queue/add', {
//         playerName: data.playerName,
//         gameName: data.gameName,
//         highScore: data.highScore || 0, // If highScore is missing, send 0
//         userId: data.userId,
//         gameId: data.gameId,
//       });

//       if (response.status === 200) {
//         console.log("Successfully added to queue");
//       } else {
//         setError("Failed to add to queue.");
//       }
//     } catch (error) {
//       setError("API call failed. Please try again.");
//       console.error("Error adding to queue:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="payment-status-container-success">
//       <h2>Payment Successful!</h2>
//       <p>Thank you for your purchase. You can now enjoy your game.</p>

//       {error && <div className="error-message">{error}</div>}

//       {loading ? (
//         <p>Loading...</p>
//       ) : (
//         <Link to="/GameSelect" className="btn btn-primary">Back to Games</Link>
//       )}
//     </div>
//   );
// };

// export default PaymentSuccess;


// import React from "react";
// import { Link } from "react-router-dom";
// import "./PaymentSuccess.css";

// const PaymentSuccess = () => {
//   return (
//     <div className="payment-status-container-success">
//       <h2>Payment Successful!</h2>
//       <p>Thank you for your purchase. You can now enjoy your game.</p>
//       <Link to="/GameSelect" className="btn btn-primary">Back to Games</Link>
//     </div>
//   );
// };

// export default PaymentSuccess;

// import React from "react";
// import { Link } from "react-router-dom";
// import "./PaymentSuccess.css"; 

// const PaymentSuccess = () => {
//   return (
//     <div className="payment-status-container">
//       <h2>Payment Successful!</h2>
//       <p>Thank you for your purchase. You can now enjoy your game.</p>
//       <Link to="/GameSelect" className="btn btn-primary">Back to Games</Link>
//     </div>
//   );
// };

// export default PaymentSuccess;
