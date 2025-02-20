
import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import SigninPage from "./pages/SigninPage";
import SignupPage from "./pages/SignupPage";
import GuestSignin from "./pages/GuestSignin";
import GameSelectionPage from "./pages/GameSelectionPage";
import PaymentSuccess from "./pages/PaymentSuccess"; 
import PaymentCancel from "./pages/PaymentCancel"; 
import CheckoutPage from "./pages/CheckoutPage"; 

console.log("Stripe Publishable Key:", process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

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
          <Route path="/success" element={<PaymentSuccess />} />  
          <Route path="/cancel" element={<PaymentCancel />} /> 
          <Route path="/checkout" element={<CheckoutPage />} /> 
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
