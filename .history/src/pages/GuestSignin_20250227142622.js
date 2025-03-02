import React, { useState } from "react";
// eslint-disable-next-line
import axios from "axios";
import { notification } from 'antd';
import { useNavigate } from "react-router-dom";
import "./../styles/GuestSignin.css";

const GuestSignin = () => {
  const [guestName, setGuestName] = useState("");
  const navigate = useNavigate();

  const API_guest_URL = "https://arcadegamebackendapi20241227164011.azurewebsites.net/api/Guest/addGuest";

  const showPopup = (message, description) => {
    notification.open({
        message,
        description,
        placement: "top", // Position at the top of the screen
        duration: 5, // Notification duration in seconds
        className: "custom-notification-aim", // Custom class for styling
    });
  };

  // const handleContinue = () => {
  //   if (guestName) {
  //     // alert(`Guest ID: ${guestName}`);
  //     navigate("/GameSelect"); // Redirect to GameSelect page after signup
  //   } else {
  //     alert("Please fill in Guest ID field!");
  //   }
  // };

  const handleContinue = async () => {
    if (guestName) {
      try {
        // Make an API request with a JSON payload
        const response = await axios.post(
          API_guest_URL,
          { guestName },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response.status === 200) {
          // alert(`Guest ID: ${guestName} is valid and you are ready to play!`);
          navigate("/GameSelect");
        } else {
          showPopup(
            "Guest Login Error", 
            "Failed to sign in with Guest ID. Please try again."
        );
        }
      } catch (error) {
        showPopup(
          "Error", 
          "There was an error with the guest login. Please try again later."
      );
      }
    } else {
      showPopup(
        "Input Warning", 
        "Please fill in Guest ID field!"
    );
    }
  };

  return (
    <div className="guest-signin-container">
      <div className="guest-signin-card">
        <h1 className="guest-signin-title">Guest ID</h1>
        <div className="guest-id-container">
          <div className="guest-background-image"> 
            <img
            src={require("./../assets/guestidPicture.png")} 
            alt="Guest ID Design"
            className="guest-id-image"
            />
          </div>
          <div>
            <input
              type="text"
              className="guest-signin-input"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
            />
          </div>  
        </div>
        <button className="guest-signin-button" onClick={handleContinue}>
          Continue
        </button>
      </div>
    </div>
  );
};

export default GuestSignin;


// copy 
// import React, { useState } from "react";
// // eslint-disable-next-line
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import "./../styles/GuestSignin.css";

// const GuestSignin = () => {
//   const [guestName, setGuestName] = useState("");
//   const navigate = useNavigate();

//   const handleContinue = () => {
//     if (guestName) {
//       alert(`Guest ID: ${guestName}`);
//       navigate("/GameSelect"); // Redirect to GameSelect page after signup
//     } else {
//       alert("Please fill in Guest ID field!");
//     }
//   };

//   // const handleContinue = async () => {
//   //   if (guestName) {
//   //     try {
//   //       // Make an API request with a JSON payload
//   //       const response = await axios.post(
//   //         "https://arcadegamebackendapi20241227164011.azurewebsites.net/api/Guest/addGuest",
//   //         { guestName },
//   //         {
//   //           headers: {
//   //             "Content-Type": "application/json",
//   //           },
//   //         }
//   //       );
//   //       if (response.status === 200) {
//   //         alert(`Guest ID: ${guestName} is valid and you are ready to play!`);
//   //         navigate("/GameSelect");
//   //       } else {
//   //         alert("Failed to sign in with Guest ID. Please try again.");
//   //       }
//   //     } catch (error) {
//   //       console.error("Error during guest login:", error);
//   //       alert("There was an error with the guest login. Please try again later.");
//   //     }
//   //   } else {
//   //     alert("Please fill in Guest ID field!");
//   //   }
//   // };

//   return (
//     <div className="guest-signin-container">
//       <div className="guest-signin-card">
//         <h1 className="guest-signin-title">Guest ID</h1>
//         <div className="guest-id-container">
//           <div className="guest-background-image"> 
//             <img
//             src={require("./../assets/guestidPicture.png")} 
//             alt="Guest ID Design"
//             className="guest-id-image"
//             />
//           </div>
//           <div>
//             <input
//               type="text"
//               className="guest-signin-input"
//               value={guestName}
//               onChange={(e) => setGuestName(e.target.value)}
//             />
//           </div>  
//         </div>
//         <button className="guest-signin-button" onClick={handleContinue}>
//           Continue
//         </button>
//       </div>
//     </div>
//   );
// };

// export default GuestSignin;
