import React from "react";

const OGImage = () => (
  <div
    style={{
      width: "1200px",
      height: "630px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "black",
      padding: "32px",
      fontFamily: "Inter, sans-serif",
    }}
  >
    <h1
      style={{
        fontSize: "96px",
        fontWeight: "bold",
        marginBottom: "16px",
        background: "linear-gradient(to right, #F596D3, #D247BF)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
      }}
    >
      NeatNGO
    </h1>
    <h2
      style={{
        fontSize: "48px",
        fontWeight: "bold",
        background: "linear-gradient(to right, #61DAFB, #1fc0f1, #03a3d7)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
      }}
    >
      NGO Management System
    </h2>
    <div
      style={{
        marginTop: "32px",
        color: "white",
        fontSize: "24px",
      }}
    >
      Streamline Your NGO Operations
    </div>
  </div>
);

export default OGImage;
