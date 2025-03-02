import { useEffect } from "react";
import axios from "axios";

const GameComponent = () => {
  useEffect(() => {
    (async () => {
      try {
        console.log("🔄 Clearing RFID Queue...");
        await axios.get(
          "https://arcadegamebackendapi20241227164011.azurewebsites.net/api/Webhook/ClearRfidQueue"
        );
        console.log(" RFID Queue Cleared!");
      } catch (err) {
        console.error(" API Error:", err);
      }
    })();
  }, []); // Runs only once on mount

  return null; // No UI needed, it just triggers the API
};

export default GameComponent;
