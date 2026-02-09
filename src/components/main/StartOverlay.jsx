// src/components/StartOverlay.jsx
import React from "react";

const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(255, 255, 255, 1)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 9999,
};

const buttonStyle = {
  padding: "15px 50px",
  fontSize: "2rem",
  cursor: "pointer",
  backgroundColor: "#444",
  color: "#fff",
  border: "none",
  borderRadius: "50px",
  marginTop: "20px",
  fontFamily: '"Amatica SC", sans-serif',
  textTransform: "uppercase",
  boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
  transition: "transform 0.2s ease"
};

const hintStyle = {
  color: "#999",
  fontSize: "0.9rem",
  marginTop: "30px",
  textAlign: "center",
  maxWidth: "250px",
  lineHeight: "1.4",
  fontFamily: "sans-serif"
};

export default function StartOverlay({ onStart }) {
  return (
    <div style={overlayStyle}>
      <h1 style={{ 
        fontFamily: '"Amatica SC", sans-serif', 
        fontSize: "4rem", 
        color: "#444", 
        margin: 0,
        letterSpacing: "2px" 
      }}>
        Just Tune
      </h1>
      
      <button 
        style={buttonStyle} 
        onClick={onStart}
        onMouseOver={(e) => e.target.style.transform = "scale(1.05)"}
        onMouseOut={(e) => e.target.style.transform = "scale(1)"}
      >
        Start
      </button>

      {/* hint for iPhone */}
      <div style={hintStyle}>
        Please ensure your device volume is up and the <strong>Silent Switch</strong> is off.
      </div>
    </div>
  );
}
