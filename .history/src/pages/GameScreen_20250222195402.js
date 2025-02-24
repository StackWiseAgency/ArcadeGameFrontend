import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

const GameScreen = () => {
    const navigate = useNavigate()
    useEffect(() => {
        // timer
        const timer = setInterval(() => {
          console.log('This will run every second!');
          navigate('/gamestartqueue')
        }, 6000);
    }, [])
  return (
    <div>GameScreen</div>
  )
}

export default GameScreen