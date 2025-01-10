import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SigninPage from "./pages/SigninPage"; // Import the login page
import SignupPage from "./pages/SignupPage";
import GuestSignin from "./pages/GuestSignin";
import GameSelectionPage from "./pages/GameSelectionPage";


function App() {
  return (
    <Router>
      <Routes>
        {/* Signin page at root */}
        <Route path="/" element={<SigninPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/signin" element={<SigninPage />} />
        <Route path="/guest" element={<GuestSignin />} />
        <Route path="/GameSelect" element={<GameSelectionPage />} />
        
      </Routes>
    </Router>
  );
}

export default App;
