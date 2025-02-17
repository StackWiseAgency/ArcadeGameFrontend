import React, { useState } from "react";
// eslint-disable-next-line
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./../styles/GuestSignin.css";

const GuestSignin = () => {
  const [guestId, setGuestId] = useState("");
  const navigate = useNavigate();

  const API_guest_URL = "https://arcadegamebackendapi20241227164011.azurewebsites.net/api/Guest/addGuest";

  const handleContinue = () => {
    if (guestId) {
      alert(`Guest ID: ${guestId}`);
      navigate("/GameSelect"); // Redirect to GameSelect page after signup
    } else {
      alert("Please fill in Guest ID field!");
    }
  };

  // const handleContinue = async () => {
  //   if (guestId) {
  //     try {
  //       // Make an API request with a JSON payload
  //       const response = await axios.post(
  //         API_guest_URL,
  //         { guestId },
  //         {
  //           headers: {
  //             "Content-Type": "application/json",
  //           },
  //         }
  //       );
  //       if (response.status === 200) {
  //         alert(`Guest ID: ${guestId} is valid and you are ready to play!`);
  //         navigate("/GameSelect");
  //       } else {
  //         alert("Failed to sign in with Guest ID. Please try again.");
  //       }
  //     } catch (error) {
  //       console.error("Error during guest login:", error);
  //       alert("There was an error with the guest login. Please try again later.");
  //     }
  //   } else {
  //     alert("Please fill in Guest ID field!");
  //   }
  // };

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
              value={guestId}
              onChange={(e) => setGuestId(e.target.value)}
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
//   const [guestId, setGuestId] = useState("");
//   const navigate = useNavigate();

//   const handleContinue = () => {
//     if (guestId) {
//       alert(`Guest ID: ${guestId}`);
//       navigate("/GameSelect"); // Redirect to GameSelect page after signup
//     } else {
//       alert("Please fill in Guest ID field!");
//     }
//   };

//   // const handleContinue = async () => {
//   //   if (guestId) {
//   //     try {
//   //       // Make an API request with a JSON payload
//   //       const response = await axios.post(
//   //         "https://arcadegamebackendapi20241227164011.azurewebsites.net/api/Guest/addGuest",
//   //         { guestId },
//   //         {
//   //           headers: {
//   //             "Content-Type": "application/json",
//   //           },
//   //         }
//   //       );
//   //       if (response.status === 200) {
//   //         alert(`Guest ID: ${guestId} is valid and you are ready to play!`);
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
//               value={guestId}
//               onChange={(e) => setGuestId(e.target.value)}
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
