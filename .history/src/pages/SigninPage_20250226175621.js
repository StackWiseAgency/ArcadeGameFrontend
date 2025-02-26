import React, { useState } from "react";
import useFocusOnClick from './useFocusOnClick';
import axios from "axios";
import GameStartQueue from "../components/GameStartQueue";
import { useNavigate, Link } from "react-router-dom";
import Coins from "./../assets/coins.png";
import "./../styles/SigninPage.css"; // Import the CSS file
const SigninPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const API_login_URL= process.env.REACT_APP_API_LOGIN_URL;

  const { inputRef, focusInput } = useFocusOnClick();

  // console.log("API_login_URL:", API_login_URL);
  const handleLogin = async (event) => {
    event.preventDefault(); // Prevent the form from refreshing the page
    if (!email || !password) {
      alert("Please enter both email and password.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert("Please enter a valid email address.");
      return;
    }
    try {
      // Create form data
      const formData = new URLSearchParams();
      formData.append("email", email);
      formData.append("password", password);
      // Send request as form data
      const response = await axios.post(
        API_login_URL,
        formData, // Pass the form data here
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded", // Form data header
          },
        }
      );
      if (response.data && response.data.dataModel) {
        const { token, user } = response.data.dataModel;
        
        // console.log("Extracted User Data:", user);
        
        // if (!token) {
        //   alert("No token received! Login might have failed.");
        //   return;
        // }

        // Store authToken securely in sessionStorage
        const filteredUserDetails = {
          name: user.name,
          username: user.username,
          profilePicture: user.picture, // Use profilePicturePath
          // profilePicture: user.picture ? `${baseURL}/uploads/${user.picture}` : null,
          email: user.email,
          role: user.role
      };
      // console.log("Filtered User Details:", filteredUserDetails);

            // Store the authToken securely in sessionStorage
            sessionStorage.setItem("authToken", token);
            // Store filtered user details in localStorage
            localStorage.setItem("authUser", JSON.stringify(filteredUserDetails));
            // Navigate to the game selection page
        navigate("/GameSelect");
      } else {
        alert("Invalid credentials, please try again.");
      }
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      if (error.response?.data?.errors) {
        alert(`Validation Errors: ${JSON.stringify(error.response.data.errors, null, 2)}`);
      } else {
        alert("An error occurred. Please try again later.");
      }
    }
  };
  return (
   
    <div className="signin-container">
      
      <div className="signin-container2">
      <h1 className="signin-title">Welcome to Fling Disc</h1>
        <GameStartQueue />
      </div>
      <div className="signin-container1">
      
           
            <form className="signin-card" onSubmit={handleLogin}>
              <div className="input-field">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="text"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="input-field">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <button type="submit" className="signin-button">
                SIGN IN TO GET REWARDS <img src={Coins} alt="coins" />
              </button>
            </form>
        
          <div className="signin-divider">
            <span className="line"></span>
            <span className="divider-text">or</span>
            <span className="line"></span>
          </div>
          <div className="signin-footer">
          <Link to="/signup" className="guest-link">
              Signup
            </Link>
            <span className="separator">|</span>
            <Link to="/guest" className="guest-link">
              Continue as a Guest
            </Link>
          </div>
        </div>
      
    </div>
    
    
  );
};
export default SigninPage;
