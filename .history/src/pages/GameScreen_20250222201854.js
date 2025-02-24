import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
//  socket.io-client
const GameScreen = () => {
    const navigate = useNavigate()
    useEffect(() => {
        // timer
        const timer = setInterval(() => {
          console.log('This will run every second!');
          // navigate('/game-of-aim"')
        }, 6000);
    }, [])
  return (
    <><div>GameScreen</div>
    <iframe src='http://localhost:3000/game-sceen'width="100vh" height='100vh' />
    </>
    
  )
}

export default GameScreen