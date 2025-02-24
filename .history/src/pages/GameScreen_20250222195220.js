import React, { useEffect } from 'react'

const GameScreen = () => {
    useEffect(() => {
        // timer
        const timer = setInterval(() => {
          console.log('This will run every second!');
        }, 6000);
    }, [])
  return (
    <div>GameScreen</div>
  )
}

export default GameScreen