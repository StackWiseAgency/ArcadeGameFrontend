import { useEffect } from "react";
import axios from "axios";

const GameComponent = () => {
  useEffect(() => {
    (async () => {
      try {
        await axios.get(
          "https://arcadegamebackendapi20241227164011.azurewebsites.net/api/Webhook/ClearRfidQueue"
        );
      } catch (err) {
        console.error("API Error:", err);
      }
    })();
  }, []); // Runs only once on mount

  return null; // No UI needed
};

export default GameComponent;
