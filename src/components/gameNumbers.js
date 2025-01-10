import React, { useState } from 'react'

const GameNumbers = ({ number, handleChange, setNumber }) => {
    return (
        <div className="input-field" style={{
            height: '100vh',
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: 'center'
        }}>
            <h2>Select Number of Games </h2>
            <input
                type='number'
                placeholder="Enter number"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
            />

            <button className="button" onClick={handleChange}>Enter</button>
        </div>
    )
}

export default GameNumbers
