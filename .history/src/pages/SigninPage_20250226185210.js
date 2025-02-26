import React, { useState } from "react";
import CustomKeyboard from "./OnScreenKeyboard"; // Import the CustomKeyboard component
import axios from "axios";
import GameStartQueue from "../components/GameStartQueue";
import { useNavigate, Link } from "react-router-dom";
import Coins from "./../assets/coins.png";
import "./../styles/SigninPage.css"; // Import the CSS file

const SigninPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [focusField, setFocusField] = useState(null); // State to manage which field is focused
  const navigate = useNavigate();
  const API_login_URL = process.env.REACT_APP_API_LOGIN_URL;

  const handleInputChange = (newValue) => {
    setEmail(newValue); // Update the email state with the new input from the keyboard
  };

  const handleKeyPress = (button) => {
    console.log("Key pressed:", button);
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    if (!email || !password) {
      alert("Please enter both email and password.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert("Please enter a valid email address.");
      return;
    }
    try {
      const formData = new URLSearchParams();
      formData.append("email", email);
      formData.append("password", password);

      const response = await axios.post(API_login_URL, formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded", // Form data header
        },
      });

      if (response.data && response.data.dataModel) {
        const { token, user } = response.data.dataModel;

        const filteredUserDetails = {
          name: user.name,
          username: user.username,
          profilePicture: user.picture,
          email: user.email,
          role: user.role,
        };

        sessionStorage.setItem("authToken", token);
        localStorage.setItem("authUser", JSON.stringify(filteredUserDetails));

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
        <form>
          <label>Email:</label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={() => setFocusField("email")} // Set the focused field
            onBlur={() => setFocusField(null)} // Remove focus when field loses focus
          />
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onFocus={() => setFocusField("password")}
            onBlur={() => setFocusField(null)}
          />
        </form>

        {/* Show keyboard only when an input field is focused */}
        <CustomKeyboard onChange={handleInputChange} onKeyPress={handleKeyPress} focusField={focusField} />
      </div>
    </div>
  );
};

export default SigninPage;


// import React, { useState } from "react";

// import OnScreenKeyboard from './OnScreenKeyboard';

// import axios from "axios";
// import GameStartQueue from "../components/GameStartQueue";
// import { useNavigate, Link } from "react-router-dom";
// import Coins from "./../assets/coins.png";
// import "./../styles/SigninPage.css"; // Import the CSS file
// const SigninPage = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const navigate = useNavigate();
//   const API_login_URL= process.env.REACT_APP_API_LOGIN_URL;

//   const [inputValue, setInputValue] = useState("");

//  const handleInputChange = (newValue) => {
//  setEmail(newValue); // Update the email state with the new input from the keyboard
//};

//const handleKeyPress = (button) => {
 // console.log("Key pressed:", button);
//};
//   // console.log("API_login_URL:", API_login_URL);
//   const handleLogin = async (event) => {
//     event.preventDefault(); // Prevent the form from refreshing the page
//     if (!email || !password) {
//       alert("Please enter both email and password.");
//       return;
//     }
//     if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
//       alert("Please enter a valid email address.");
//       return;
//     }
//     try {
//       // Create form data
//       const formData = new URLSearchParams();
//       formData.append("email", email);
//       formData.append("password", password);
//       // Send request as form data
//       const response = await axios.post(
//         API_login_URL,
//         formData, // Pass the form data here
//         {
//           headers: {
//             "Content-Type": "application/x-www-form-urlencoded", // Form data header
//           },
//         }
//       );
//       if (response.data && response.data.dataModel) {
//         const { token, user } = response.data.dataModel;
        
//         // console.log("Extracted User Data:", user);
        
//         // if (!token) {
//         //   alert("No token received! Login might have failed.");
//         //   return;
//         // }

//         // Store authToken securely in sessionStorage
//         const filteredUserDetails = {
//           name: user.name,
//           username: user.username,
//           profilePicture: user.picture, // Use profilePicturePath
//           // profilePicture: user.picture ? `${baseURL}/uploads/${user.picture}` : null,
//           email: user.email,
//           role: user.role
//       };
//       // console.log("Filtered User Details:", filteredUserDetails);

//             // Store the authToken securely in sessionStorage
//             sessionStorage.setItem("authToken", token);
//             // Store filtered user details in localStorage
//             localStorage.setItem("authUser", JSON.stringify(filteredUserDetails));
//             // Navigate to the game selection page
//         navigate("/GameSelect");
//       } else {
//         alert("Invalid credentials, please try again.");
//       }
//     } catch (error) {
//       console.error("Login failed:", error.response?.data || error.message);
//       if (error.response?.data?.errors) {
//         alert(`Validation Errors: ${JSON.stringify(error.response.data.errors, null, 2)}`);
//       } else {
//         alert("An error occurred. Please try again later.");
//       }
//     }
//   };
//   return (
   
//     <div className="signin-container">
      
//       <div className="signin-container2">
//       <h1 className="signin-title">Welcome to Fling Disc</h1>
//         <GameStartQueue />
//       </div>
//       <div className="signin-container1">
      
           
//             <form className="signin-card" onSubmit={handleLogin}>
//               <div className="input-field">
//                 <label htmlFor="email">Email</label>
//                 <input
               
//                   id="email"
//                   type="text"
//                   placeholder="Enter your email"
//                   value={email}
                
//                   onChange={(e) => setEmail(e.target.value)}
                  
//                 />
//               </div>
//               <div className="input-field">
//                 <label htmlFor="password">Password</label>
//                 <input
//                   id="password"
//                   type="password"
//                   placeholder="Enter your password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                 />
//               </div>
//               <button type="submit" className="signin-button">
//                 SIGN IN TO GET REWARDS <img src={Coins} alt="coins" />
//               </button>
//             </form>
        
//           <div className="signin-divider">
//             <span className="line"></span>
//             <span className="divider-text">or</span>
//             <span className="line"></span>
//           </div>
//           <div className="signin-footer">
//           <Link to="/signup" className="guest-link">
//               Signup
//             </Link>
//             <span className="separator">|</span>
//             <Link to="/guest" className="guest-link">
//               Continue as a Guest
//             </Link>
//           </div>
//         </div>
//         <OnScreenKeyboard
//          onChange={handleInputChange} onKeyPress={handleKeyPress} focusField={focusField} 
//         />
//     </div>
    
    
//   );
// };
// export default SigninPage;
