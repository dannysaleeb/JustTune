import React from "react";

// displays the note (text)

function Notation({ results }) {
  if (!results || results.length === 0) return null;

  // Ensure results is always an array
  const resArray = Array.isArray(results) ? results : [results];

  return (
    <div style={{
      marginTop: "20px",
      padding: "10px",
      border: "1px solid #ccc",
      borderRadius: "6px",
      maxWidth: "300px",
      background: "#f9f9f9"
    }}>
      {resArray.map((r, idx) => (
        <div key={idx} style={{ marginBottom: "10px" }}>
          <p><strong>Partial {r.partial}:</strong></p>
          <p>Frequency: {r.frequency.toFixed(2)} Hz</p>
          <p>Nearest Note: {r.nearestNote}</p>
          <p>Cent Deviation: {r.cents.toFixed(2)} cents</p>
        </div>
      ))}
    </div>
  );
}

export default Notation;