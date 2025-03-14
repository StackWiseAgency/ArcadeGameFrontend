
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import SigninPage from "./pages/SigninPage";
import SignupPage from "./pages/SignupPage";
import GuestSignin from "./pages/GuestSignin";
import GameSelectionPage from "./pages/GameSelectionPage";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentCancel from "./pages/PaymentCancel";

import PlayersQueue from "./components/PlayersQueue";
import GameStartQueue from "./components/GameStartQueue";


import TicTacToeGame from "./components/TicTacToeGame";
import DiscArcadeModeGame from "./components/DiscArcadeModeGame";
import AimPointGame from "./components/AimPointGame";
import LightsOutWorld from "./components/LightsOutWorld";
import GameofAim from "./components/GameofAim";
import GameScreen from "./pages/GameScreen";


// Load the Stripe object with your publishable key
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);
// console.log("Stripe Publishable Key:", process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);
function App() {
  return (
    <Router>
      <Elements stripe={stripePromise}>
        <Routes>
          <Route path="/" element={<SigninPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/signin" element={<SigninPage />} />
          <Route path="/guest" element={<GuestSignin />} />
          <Route path="/GameSelect" element={<GameSelectionPage />} />
          <Route path="/playersqueue" element={<PlayersQueue />} />
          <Route path="/gamestartqueue" element={<GameStartQueue />} />

          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/payment-cancel" element={<PaymentCancel />} />

          <Route path="/tic-tac-toe" element={<TicTacToeGame />} />
          <Route path="/disc-arcade" element={<DiscArcadeModeGame />} />
          <Route path="/aimpoint" element={<AimPointGame />} />
          <Route path="/lights-out" element={<LightsOutWorld />} />
          <Route path="/game-of-aim" element={<GameofAim />} />
          
          <Route path="/game-sceen" element={<GameScreen />} />
          <Route path="/game-screen" element={<GameScreen />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Elements>
    </Router>
  );
}

// 404 Not Found Page
function NotFound() {
  return <h2 style={{ textAlign: "center" }}>404 - Page Not Found</h2>;
}

export default App;


// import React from "react";
// import { HashRouter as Router, Routes, Route } from "react-router-dom";
// import { Elements } from "@stripe/react-stripe-js";
// import { loadStripe } from "@stripe/stripe-js";

// import SigninPage from "./pages/SigninPage";
// import SignupPage from "./pages/SignupPage";
// import GuestSignin from "./pages/GuestSignin";
// import GameSelectionPage from "./pages/GameSelectionPage";
// import PaymentSuccess from "./pages/PaymentSuccess"; 
// import PaymentCancel from "./pages/PaymentCancel"; 
// import CheckoutPage from "./pages/CheckoutPage"; 

// // console.log("Stripe Publishable Key:", process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

// const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

// function App() {
//   return (
//     <Router>
//       <Elements stripe={stripePromise}>
//         <Routes>
//           <Route path="/" element={<SigninPage />} />
//           <Route path="/signup" element={<SignupPage />} />
//           <Route path="/signin" element={<SigninPage />} />
//           <Route path="/guest" element={<GuestSignin />} />
//           <Route path="/GameSelect" element={<GameSelectionPage />} />
//           <Route path="/success" element={<PaymentSuccess />} />  
//           <Route path="/cancel" element={<PaymentCancel />} /> 
//           <Route path="/checkout" element={<CheckoutPage />} /> 
//           <Route path="*" element={<NotFound />} />
//         </Routes>
//       </Elements>
//     </Router>
//   );
// }

// // 404 Not Found Page
// function NotFound() {
//   return <h2 style={{ textAlign: "center" }}>404 - Page Not Found</h2>;
// }

// export default App;


// import React from "react";
// import { HashRouter as Router, Routes, Route } from "react-router-dom";
// import { Elements } from "@stripe/react-stripe-js";
// import { loadStripe } from "@stripe/stripe-js";

// import SigninPage from "./pages/SigninPage";
// import SignupPage from "./pages/SignupPage";
// import GuestSignin from "./pages/GuestSignin";
// import GameSelectionPage from "./pages/GameSelectionPage";

// const stripePromise = loadStripe("your_publishable_key_here");

// function App() {
//   return (
//     <Router>
//        <Elements stripe={stripePromise}>
//           <Routes>
//             <Route path="/" element={<SigninPage />} />
//             <Route path="/signup" element={<SignupPage />} />
//             <Route path="/signin" element={<SigninPage />} />
//             <Route path="/guest" element={<GuestSignin />} />
//             <Route path="/GameSelect" element={<GameSelectionPage />} />

//             {/* Handle 404 Routes */}
//             <Route path="*" element={<NotFound />} />
//           </Routes>
//        </Elements>
//     </Router>
//   );
// }

// // Fallback Page for 404 Routes
// function NotFound() {
//   return <h2 style={{ textAlign: "center" }}>404 - Page Not Found</h2>;
// }

// export default App;
