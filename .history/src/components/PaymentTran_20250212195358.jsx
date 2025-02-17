
import React, { useState } from "react";
import "./PaymentTran.css";
import PaymentMachineCard from "../assets/payment-machine-plus-card.png";

const PaymentTran = ({ selectedGame, onClose }) => {
  const [paymentStatus, setPaymentStatus] = useState(false);

  const handlePayment = () => {
    setTimeout(() => {
      setPaymentStatus(true); // Change to success state
    }, 1000); // Simulate a 1-second delay
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

        {!paymentStatus ? (
          <>
            <div className="play-content">  
              <h2>Tap 'Play' to Start Your Adventure!</h2>
              <p>
                Please proceed to the POS machine to complete your payment and
                unlock the game. Get ready for fun!
              </p>
            </div>  
            <div className="spinner-container">
              <div className="spinner white-spinner"></div>
            </div>
            <button onClick={handlePayment} className="play-button">
              Play
            </button>
          </>
        ) : (
          <>
            <h2>Payment Successfully Completed!</h2>
            <p>You're all set — proceed to the game and enjoy!</p>
            <div className="spinner-container">
              <div className="spinner green-spinner"></div>
              <div className="tick-mark"></div>
            </div>
            <button onClick={onClose} className="continue-button">
              Continue
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentTran;

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

