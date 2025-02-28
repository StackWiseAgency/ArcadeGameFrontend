
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from 'axios';
import { notification} from "antd";
import "./../styles/SignupPage.css";
import Coins from "./../assets/coins.png";
import defaultprofile from "./../assets/maleavatar.png";
import QRCodeImage from "./../assets/qr-code1.png";

const SignupPage = () => {
  const [formData, setFormData] = useState({
    profilePicture: null,
    name: "",
    username: "",
    email: "",
    password: "",
    optInRecording: false,
    subscribeMailing: false,
    
  });

  const showPopup = (message, description) => {
      notification.open({
        message,
        description,
        placement: "top",
        duration: 5,
        className: "custom-notification-aim",
      });
  };
  const API_signup_URL="https://arcadegamebackendapi20241227164011.azurewebsites.net/api/Auth/Register";
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    if (files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          profilePicture: files[0],  // Directly store the file object
        });
      };
      reader.readAsDataURL(files[0]);
    }
  };

  // const handleSignup = () => {
  //   if (formData.name && formData.username && formData.email && formData.password) {
  //     alert("Account created successfully!");
  //     navigate("/GameSelect");
  //   } else {
  //     alert("Please fill in all required fields!");
  //   }
  //   ////////////////////////
  
  const handleSignup = async () => {
    if (formData.name && formData.username && formData.email && formData.password) {
      try {
        
        const formDataToSend = new FormData();
        if (formData.profilePicture) {
          formDataToSend.append("profilePicture", formData.profilePicture);  
        }
        formDataToSend.append("name", formData.name);
        formDataToSend.append("username", formData.username);
        formDataToSend.append("email", formData.email);
        formDataToSend.append("password", formData.password);
        formDataToSend.append("optInRecording", formData.optInRecording);
        formDataToSend.append("subscribeMailing", formData.subscribeMailing);
        
        const result = await axios.post(API_signup_URL, formDataToSend, {
          headers: {
            "Content-Type": "multipart/form-data", 
          },
        });

        if (result.status === 200) {
          showPopup("Account created successfully!");
          navigate("/signin");
        }
      } catch (error) {
        console.error("Error creating account:", error.response || error.message);
        showPopup("There was an error creating your account. Please try again later.");
      }
    } else {
      showPopup("Please fill in all required fields!");
    }
  };

  return (
    <div className="signup-container">
      <h1 className="signup-title">Welcome to Fling Disc</h1>
      <div className="signup-card">
        <div className="profile-picture">
          <img src={formData.profilePicture ? URL.createObjectURL(formData.profilePicture) : defaultprofile} alt="Profile" />
          <div>
            <input
              type="file"
              id="fileInput"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
            <button
              className="upload-btn"
              onClick={() => document.getElementById('fileInput').click()} 
            >
              +
            </button>
          </div>
        </div>
        <div className="input-field">
          <label htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            name="name"
            placeholder=""
            value={formData.name}
            onChange={handleInputChange}
          />
        </div>
        <div className="input-field">
          <label htmlFor="username">User Name</label>
          <input
            id="username"
            type="text"
            name="username"
            placeholder=""
            value={formData.username}
            onChange={handleInputChange}
          />
        </div>
        <div className="input-field">
          <label htmlFor="email">Email Address</label>
          <input
            id="email"
            type="email"
            name="email"
            placeholder=""
            value={formData.email}
            onChange={handleInputChange}
          />
        </div>
        <div className="input-field">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            placeholder=""
            value={formData.password}
            onChange={handleInputChange}
          />
        </div>
        <div className="checkbox-group">
          <label>
            <input
              type="checkbox"
              name="optInRecording"
              checked={formData.optInRecording}
              onChange={handleInputChange}
            />
            Opt-in for Video Recording
          </label>
          <label>
            <input
              type="checkbox"
              name="subscribeMailing"
              checked={formData.subscribeMailing}
              onChange={handleInputChange}
            />
            Subscribe to Mailing Lists
          </label>
        </div>
        <button className="signup-button" onClick={handleSignup}>
          SIGN UP TO GET REWARDS <img src={Coins} alt="Coins" />
        </button>
        <div className="signup-divider">
          <span className="line"></span>
          <span className="divider-text">or</span>
          <span className="line"></span>
        </div>
        <div className="signup-footer">
          <Link to="/signin" className="guest-link">
            Sign in
          </Link>
          <span className="separator"> | </span>
          <Link to="/guest" className="guest-link">
            Continue as a Guest
          </Link>
        </div>
        
        <div className="qr-section">
          <img src={QRCodeImage} alt="QR Code" className="qr-code" />
          <p>Scan this QR code to complete your registration on your personal device.</p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;

// copy 

// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from 'axios';
// import "./../styles/SignupPage.css";
// import Coins from "./../assets/coins.png";
// import defaultprofile from "./../assets/default-profile.png";
// import QRCodeImage from "./../assets/qr-code.png";

// const SignupPage = () => {
//   const [formData, setFormData] = useState({
//     profilePicture: null,
//     name: "",
//     username: "",
//     email: "",
//     password: "",
//     optInRecording: false,
//     subscribeMailing: false,
    
//   });

//   const navigate = useNavigate();

//   const handleInputChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData({
//       ...formData,
//       [name]: type === "checkbox" ? checked : value,
//     });
//   };

//   const handleFileChange = (e) => {
//     const files = e.target.files;
//     if (files[0]) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setFormData({
//           ...formData,
//           profilePicture: files[0],  // Directly store the file object
//         });
//       };
//       reader.readAsDataURL(files[0]);
//     }
//   };

//   // const handleSignup = () => {
//   //   if (formData.name && formData.username && formData.email && formData.password) {
//   //     alert("Account created successfully!");
//   //     navigate("/GameSelect");
//   //   } else {
//   //     alert("Please fill in all required fields!");
//   //   }
//   //   ////////////////////////
  
//   const handleSignup = async () => {
//     if (formData.name && formData.username && formData.email && formData.password) {
//       try {
        
//         const formDataToSend = new FormData();
//         if (formData.profilePicture) {
//           formDataToSend.append("profilePicture", formData.profilePicture);  
//         }
//         formDataToSend.append("name", formData.name);
//         formDataToSend.append("username", formData.username);
//         formDataToSend.append("email", formData.email);
//         formDataToSend.append("password", formData.password);
//         formDataToSend.append("optInRecording", formData.optInRecording);
//         formDataToSend.append("subscribeMailing", formData.subscribeMailing);
        
//         const result = await axios.post("https://arcadegamebackendapi20241227164011.azurewebsites.net/api/Auth/Register", formDataToSend, {
//           headers: {
//             "Content-Type": "multipart/form-data", 
//           },
//         });

//         if (result.status === 200) {
//           alert("Account created successfully!");
//           navigate("/GameSelect");
//         }
//       } catch (error) {
//         console.error("Error creating account:", error.response || error.message);
//         alert("There was an error creating your account. Please try again later.");
//       }
//     } else {
//       alert("Please fill in all required fields!");
//     }
//   };

//   return (
//     <div className="signup-container">
//       <h1 className="signup-title">Welcome to Fling Disc</h1>
//       <div className="signup-card">
//         <div className="profile-picture">
//           <img src={formData.profilePicture ? URL.createObjectURL(formData.profilePicture) : defaultprofile} alt="Profile" />
//           <div>
//             <input
//               type="file"
//               id="fileInput"
//               onChange={handleFileChange}
//               style={{ display: 'none' }}
//             />
//             <button
//               className="upload-btn"
//               onClick={() => document.getElementById('fileInput').click()} 
//             >
//               +
//             </button>
//           </div>
//         </div>
//         <div className="input-field">
//           <label htmlFor="name">Name</label>
//           <input
//             id="name"
//             type="text"
//             name="name"
//             placeholder=""
//             value={formData.name}
//             onChange={handleInputChange}
//           />
//         </div>
//         <div className="input-field">
//           <label htmlFor="username">User Name</label>
//           <input
//             id="username"
//             type="text"
//             name="username"
//             placeholder=""
//             value={formData.username}
//             onChange={handleInputChange}
//           />
//         </div>
//         <div className="input-field">
//           <label htmlFor="email">Email Address</label>
//           <input
//             id="email"
//             type="email"
//             name="email"
//             placeholder=""
//             value={formData.email}
//             onChange={handleInputChange}
//           />
//         </div>
//         <div className="input-field">
//           <label htmlFor="password">Password</label>
//           <input
//             id="password"
//             type="password"
//             name="password"
//             placeholder=""
//             value={formData.password}
//             onChange={handleInputChange}
//           />
//         </div>
//         <div className="checkbox-group">
//           <label>
//             <input
//               type="checkbox"
//               name="optInRecording"
//               checked={formData.optInRecording}
//               onChange={handleInputChange}
//             />
//             Opt-in for Video Recording
//           </label>
//           <label>
//             <input
//               type="checkbox"
//               name="subscribeMailing"
//               checked={formData.subscribeMailing}
//               onChange={handleInputChange}
//             />
//             Subscribe to Mailing Lists
//           </label>
//         </div>
//         <button className="signup-button" onClick={handleSignup}>
//           SIGN UP TO GET REWARDS <img src={Coins} alt="Coins" />
//         </button>
//         <div className="signup-divider">
//           <span className="line"></span>
//           <span className="divider-text">or</span>
//           <span className="line"></span>
//         </div>
//         <div className="signup-footer">
//           <a href="/signin" className="guest-link">
//             Sign in
//           </a>
//           <span className="separator">|</span>
//           <a href="/guest" className="guest-link">
//             Continue as a Guest
//           </a>
//         </div>
        
//         <div className="qr-section">
//           <img src={QRCodeImage} alt="QR Code" className="qr-code" />
//           <p>Scan this QR code to complete your registration on your personal device.</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SignupPage;

