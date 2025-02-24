import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
//  socket.io-client
const GameScreen = () => {
    const navigate = useNavigate()
    useEffect(() => {
        // timer
//addEventListener
// navigate(hame)
    }, [])
  return (
    <><div>GameScreen</div>
    <iframe src='http://localhost:3000/game-sceen'width="800px" height='600px' />
    </>
    
  )
}

export default GameScreen