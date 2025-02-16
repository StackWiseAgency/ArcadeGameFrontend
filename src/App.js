import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import SigninPage from "./pages/SigninPage";
import SignupPage from "./pages/SignupPage";
import GuestSignin from "./pages/GuestSignin";
import GameSelect from "./pages/GameSelectionPage"; 

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SigninPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/signin" element={<SigninPage />} />
        <Route path="/guest" element={<GuestSignin />} />
        <Route path="/game-select" element={<GameSelect />} />

        {/* Handle 404 Routes */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

// Fallback Page for 404 Routes
function NotFound() {
  return <h2 style={{ textAlign: "center" }}>404 - Page Not Found</h2>;
}

export default App;
