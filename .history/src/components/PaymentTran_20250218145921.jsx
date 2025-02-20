
import React, { useState } from "react";
import "./PaymentTran.css";
import PaymentMachineCard from "../assets/payment-machine-plus-card.png";

const PaymentTran = ({ selectedGame, onClose }) => {
  const [paymentStatus, setPaymentStatus] = useState("idle"); // "idle", "loading", "success", "error"

  const handlePayment = () => {
    setPaymentStatus("loading"); // Show spinner

    setTimeout(() => {
      const success = Math.random() > 0.1; // Simulate 90% success rate
      if (success) {
        setPaymentStatus("success");
      } else {
        setPaymentStatus("error");
      }
    }, 1000);
  };

  return (
    <div className="payment-modal-container">
      <div className="modal-overlay"></div>
      <div className="payment-modal">
        <img
          src={PaymentMachineCard}
          alt="Payment Machine"
          className="payment-machine-image"
        />

        {paymentStatus === "idle" && (
          <>
            <div className="play-content">
              <h2>Tap 'Play' to Start {selectedGame?.name || "Your Game"}!</h2>
              <p>
                Please proceed to the POS machine to complete your payment and unlock the game.
                Get ready for fun!
              </p>
            </div>
            <div className="spinner-container">
              <div className="spinner white-spinner"></div>
            </div>
            <button onClick={handlePayment} className="play-button">
              Play
            </button>
          </>
        )}

        {paymentStatus === "loading" && (
          <>
            <h2>Processing Payment...</h2>
            <div className="spinner-container">
              <div className="spinner white-spinner"></div>
            </div>
          </>
        )}

        {paymentStatus === "success" && (
          <>
            <h2>Payment Successfully Completed!</h2>
            <p>You're all set — proceed to the game and enjoy!</p>
            <div className="spinner-container">
              <div className="tick-mark"></div>
            </div>
            <button onClick={onClose} className="continue-button">
              Continue
            </button>
          </>
        )}

        {paymentStatus === "error" && (
          <>
            <h2>Payment Failed</h2>
            <p>Please try again.</p>
            <div className="spinner-container">
              <p className="error-message">Transaction could not be completed.</p>
            </div>
            <button onClick={handlePayment} className="retry-button">
              Retry Payment
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentTran;


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

