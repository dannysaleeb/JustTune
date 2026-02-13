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
  padding: "40px 20px",
  boxSizing: "border-box"
};

const titleStyle = {
  fontFamily: '"Amatica SC", sans-serif',
  fontSize: "5rem",
  color: "#444",
  margin: 0,
  letterSpacing: "3px",
  fontWeight: "700"
};

const buttonStyle = {
  padding: "15px 60px",
  fontSize: "2.2rem",
  cursor: "pointer",
  backgroundColor: "#444",
  color: "#fff",
  border: "none",
  borderRadius: "50px",
  marginTop: "40px",
  fontFamily: '"Amatica SC", sans-serif',
  textTransform: "uppercase",
  boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
  transition: "all 0.2s ease",
  outline: "none"
};

const creditsStyle = {
  position: "absolute",
  bottom: "40px",
  color: "#999",
  fontSize: "0.8rem",
  textAlign: "center",
  maxWidth: "450px",
  lineHeight: "1.6",
  fontFamily: "system-ui, -apple-system, sans-serif",
  borderTop: "1px solid #eee",
  paddingTop: "25px"
};

export default function StartOverlay({ onStart }) {
  return (
    <div style={overlayStyle}>
      <h1 style={titleStyle}>
        Just Tune
      </h1>
      
      <button 
        style={buttonStyle} 
        onClick={onStart}
        onMouseOver={(e) => {
          e.target.style.transform = "translateY(-3px)";
          e.target.style.boxShadow = "0 15px 30px rgba(0,0,0,0.15)";
        }}
        onMouseOut={(e) => {
          e.target.style.transform = "translateY(0)";
          e.target.style.boxShadow = "0 10px 20px rgba(0,0,0,0.1)";
        }}
      >
        Start
      </button>

      <div style={creditsStyle}>
        <p style={{ margin: "0 0 4px 0", color: "#666", fontWeight: "500" }}>
          Fintan O'Hare & Danny Saleeb
        </p>
        <p style={{ margin: "0 0 12px 0" }}>
          Based on an original app by Martin Suckling
        </p>
        <p style={{ margin: 0, fontSize: "0.75rem", opacity: 1.0 }}>
          Commissioned by Clement Power with funding from the <br/>
          mdw – University of Music and Performing Arts Vienna
        </p>
      </div>
    </div>
  );
}