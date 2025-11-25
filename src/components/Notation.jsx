import React from "react";

function Notation({ fundamental, partials }) {
  if (!fundamental) return null;

  const formatFreq = (hz) => hz.toFixed(3);
  const formatCents = (c) => (c ?? 0).toFixed(2);

  return (
    <div
      style={{
        marginTop: "20px",
        padding: "10px",
        border: "1px solid #ccc",
        borderRadius: "6px",
        maxWidth: "450px",
        background: "#f9f9f9",
        fontFamily: "sans-serif"
      }}
    >
      {/* Fundamental */}
      <div style={{ display: "flex", gap: "15px", marginBottom: "10px" }}>
        <strong>Fundamental:</strong>
        <div style={{ minWidth: "80px" }}>Freq: {formatFreq(fundamental.frequency)} Hz</div>
        <div>Note: {fundamental.name}{fundamental.octave}</div>
      </div>

      {/* Partials */}
      {partials && partials.length > 0 && (
        <div>
          {partials.map((p) => (
            <div
              key={p.partialNumber}
              style={{
                display: "flex",
                gap: "15px",
                marginBottom: "6px",
                alignItems: "center"
              }}
            >
              <strong>Partial {p.partialNumber}:</strong>
              <div style={{ minWidth: "80px" }}>Freq: {formatFreq(p.frequency)} Hz</div>
              <div>Note: {p.note.name}{p.note.octave}</div>
              <div>Cent Deviation: {formatCents(p.note.centDeviation)} cents</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Notation;