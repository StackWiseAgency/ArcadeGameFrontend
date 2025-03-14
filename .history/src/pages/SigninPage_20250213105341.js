import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Coins from "./../assets/coins.png";
import "./../styles/SigninPage.css"; // Import the CSS file

const SigninPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const API_login_URL="https://arcadegamebackendapi20241227164011.azurewebsites.net/api/Auth/Login";

  // const handleLogin = () => {
  //   if (useremail && password) {
  //     navigate("/GameSelect");
  //   } else {
  //     alert("Please enter both useremail and password");
  //   }
  // };

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
      console.log("Request Payload:", { email, password });

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

      console.log("Response Data:", response.data);
      if (response.status === 200) {
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
      <h1 className="signin-title">Welcome to Fling Disc</h1>
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
        <a href="/signup" className="guest-link">
          Signup
        </a>
        <span className="separator">|</span>
        <a href="/guest" className="guest-link">
          Continue as a Guest
        </a>
      </div>
    </div>
  );
};

export default SigninPage;

// copy 
// import React, { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import Coins from "./../assets/coins.png";
// import "./../styles/SigninPage.css"; // Import the CSS file

// const SigninPage = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const navigate = useNavigate();

//   // const handleLogin = () => {
//   //   if (useremail && password) {
//   //     navigate("/GameSelect");
//   //   } else {
//   //     alert("Please enter both useremail and password");
//   //   }
//   // };

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
//       console.log("Request Payload:", { email, password });

//       // Create form data
//       const formData = new URLSearchParams();
//       formData.append("email", email);
//       formData.append("password", password);

//       // Send request as form data
//       const response = await axios.post(
//         "https://arcadegamebackendapi20241227164011.azurewebsites.net/api/Auth/Login",
//         formData, // Pass the form data here
//         {
//           headers: {
//             "Content-Type": "application/x-www-form-urlencoded", // Form data header
//           },
//         }
//       );

//       console.log("Response Data:", response.data);
//       if (response.status === 200) {
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
//       <h1 className="signin-title">Welcome to Fling Disc</h1>
//       <form className="signin-card" onSubmit={handleLogin}>
//         <div className="input-field">
//           <label htmlFor="email">Email</label>
//           <input
//             id="email"
//             type="text"
//             placeholder="Enter your email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//           />
//         </div>
//         <div className="input-field">
//           <label htmlFor="password">Password</label>
//           <input
//             id="password"
//             type="password"
//             placeholder="Enter your password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//           />
//         </div>
//         <button type="submit" className="signin-button">
//           SIGN IN TO GET REWARDS <img src={Coins} alt="coins" />
//         </button>
//       </form>
//       <div className="signin-divider">
//         <span className="line"></span>
//         <span className="divider-text">or</span>
//         <span className="line"></span>
//       </div>
//       <div className="signin-footer">
//         <a href="/signup" className="guest-link">
//           Signup
//         </a>
//         <span className="separator">|</span>
//         <a href="/guest" className="guest-link">
//           Continue as a Guest
//         </a>
//       </div>
//     </div>
//   );
// };

// export default SigninPage;

