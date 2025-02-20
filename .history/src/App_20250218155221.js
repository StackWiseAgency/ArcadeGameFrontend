import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import SigninPage from "./pages/SigninPage";
import SignupPage from "./pages/SignupPage";
import GuestSignin from "./pages/GuestSignin";
import GameSelectionPage from "./pages/GameSelectionPage";

const stripePromise = loadStripe("your_publishable_key_here");

function App() {
  return (
    <Router>
       <Elements stripe={stripePromise}></Elements>
          <Routes>
            <Route path="/" element={<SigninPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/signin" element={<SigninPage />} />
            <Route path="/guest" element={<GuestSignin />} />
            <Route path="/GameSelect" element={<GameSelectionPage />} />

            {/* Handle 404 Routes */}
            <Route path="*" element={<NotFound />} />
          </Routes>
       </Elements>
    </Router>
  );
}

// Fallback Page for 404 Routes
function NotFound() {
  return <h2 style={{ textAlign: "center" }}>404 - Page Not Found</h2>;
}

export default App;
