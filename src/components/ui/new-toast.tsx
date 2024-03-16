import * as React from "react";
import { useState, useEffect } from "react";
import { cn } from "../../lib/utils";

const Toast = ({ title, description }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, 10000); // Hide the toast after 5 seconds

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setVisible(false);
  };

  return (
    <>
{visible && (
  <div
    style={{
      position: "absolute",
      color: "black",
      zIndex: 10,
      backgroundColor: "#979ba3",
      width: "30%",
      padding: "2%",
      display: "flex",
      gap: "3%",
      borderRadius: "4px",
      alignItems: "center",
      justifyContent: "center",
      right: "0%",
      top: "10%",
    }}
  >
    <div
      className="flex items-center"
      style={{
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Lato",
        fontSize: "18px",
        width: '100%',
        textAlign: 'center'
      }}
    >
      <div style={{fontWeight: '600'}}>{title}</div>
      <div style={{ fontStyle: "italic", fontSize: "15.5px" }}>
        {description}
      </div>
    </div>
    <button
      style={{
        border: "1px solid #fdd800",
        backgroundColor: "#181b2a",
        color: "#979ba3",
        padding: "1.5% 3%",
        borderRadius: "2px",
        // transform: "translateY(-20px) translateX(-35px)",
        fontSize: '11px'
      }}
      onClick={handleClose}
    >
      X
    </button>
  </div>
)}

    </>
  );
};

export default Toast;
